import { Injectable } from '@angular/core';
import { Collection } from 'ol';
import LayerGroup from 'ol/layer/Group';
import VectorTileLayer from 'ol/layer/VectorTile';
import { StyleFunction } from 'ol/style/Style';
import { KaartlaagConfiguratie } from '~viewer/kaart/types/kaartlaag-configuratie';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { MapboxStyleService } from '~viewer/kaart/services/helpers/mapbox-style.service';
import { KaartlaagUtils } from '~viewer/kaart/utils/kaartlaag-utils';
import { TilegridService } from '~viewer/kaart/services/tilegrid.service';
import { OlStylesConfig } from '~viewer/kaart/types/ol-styles.config';
import { zIndices } from '~viewer/kaart/services/kaart.service';
import { SymboolLocatie } from '~store/common/selection/selection.model';
import { ImroKaartStyleConfig } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import { AnyLayer, Style } from 'mapbox-gl';

const MAX_RESOLUTION = 8;

@Injectable({
  providedIn: 'root',
})
export class ImroPlanlagenService {
  public config: KaartlaagConfiguratie;
  public lagen = new LayerGroup();
  private currentPlanIds: string[] = [];
  private currentIds: string[] = [];
  private currentLayers: VectorTileLayer[] = [];
  private timeOut: ReturnType<typeof setTimeout>;

  constructor(
    private layerFactoryService: KaartlaagFactoryService,
    private styleService: MapboxStyleService,
    private tilegridService: TilegridService,
    private mapBoxStyleService: MapboxStyleService
  ) {}

  public resetSelections(): void {
    this.resetMap();
    this.currentIds = [];
  }

  public resetMap(): void {
    this.currentPlanIds = [];
    this.currentLayers = [];
    this.lagen.setLayers(new Collection(this.currentLayers));
  }

  public resetLagen(planIds: string[], add: boolean): LayerGroup {
    this.config = this.layerFactoryService.layerConfigFormat.ruimtelijkeplannenlagen;
    // lagen kunnen kennelijk niet direct worden toegevoegd of verwijderd, op deze manier werkt het wel
    planIds.forEach(planId => {
      if (add && !this.currentPlanIds.includes(planId)) {
        this.currentPlanIds.push(planId);
        this.currentLayers.push(this.layerFactoryService.initializeLayer(this.config, planId) as VectorTileLayer);
      } else if (!add && this.currentPlanIds.includes(planId)) {
        const layerToRemove = KaartlaagUtils.getLayerByIdFromLayerGroup(this.lagen, planId) as VectorTileLayer;
        this.currentPlanIds = this.currentPlanIds.filter(value => value !== planId);
        this.currentLayers = this.currentLayers.filter(value => value !== layerToRemove);
      }
      const layerCollection = new Collection(this.currentLayers);
      this.lagen.setLayers(layerCollection);
      this.lagen.setZIndex(zIndices.ImroPlanLagen);
    });
    return this.lagen;
  }

  public applyKaartStyle(documentId: string, styleConfig: ImroKaartStyleConfig): void {
    const style = { ...styleConfig.style };
    this.currentIds = [];
    this.resetLagen([documentId], true);
    // voeg transparante layers toe om details op locatie ook te laten werken
    // wanneer de vulling van een vlak in de kaartstyle 'leeg' is
    const styleLayers = style.layers.concat(this.styleService.getTransparantlayers());
    style.layers = styleLayers;
    const layer = KaartlaagUtils.getLayerByIdFromLayerGroup(this.lagen, documentId) as VectorTileLayer;
    if (styleConfig.naam === documentId) {
      this.applyStyleBPachtigen(layer, style, documentId, []);
    } else {
      // vorm vrije plannen
      this.mapBoxStyleService.applyStyle(layer, style, 'plan');
    }
  }

  public resetStyleWithCartografieInfo(
    documentId: string,
    kaartObjectIds: string[],
    imroKaarten: ImroKaartStyleConfig[]
  ): void {
    const styles = imroKaarten.map(kaart => kaart.style);

    const plangebiedGrensStyleLayers = styles[0].layers.filter(styleLayer =>
      styleLayer.id.includes('plangebied_grens')
    );

    // loop over de imrokaarten en voeg indexen toe tbv sorteren
    const allStyleLayers = styles
      .map((style, styleIndex) => style.layers.map((layer, layerIndex) => ({ ...layer, styleIndex, layerIndex })))
      .flat();

    // bepaal de relevante mapboxstyle lagen aan de hand van de kaartObjectIds uit de catografieInfo
    const filteredStyleLayers = kaartObjectIds
      .map(object =>
        allStyleLayers
          .map(layer => (layer.type !== 'custom' && layer.filter && layer.filter.includes(object) ? layer : undefined))
          .filter(l => l !== undefined)
      )
      .flat();

    // sorteer de lagen aan de hand van de indexen (eerst op kaartstyle vervolgens op stylelaag)
    filteredStyleLayers.sort((a, b) => b.styleIndex - a.styleIndex || a.layerIndex - b.layerIndex);

    const style: Style = {
      ...styles[0],
      layers: filteredStyleLayers,
    };

    // voeg de plangebied_grens stylelagen en transparante lagen toe
    style.layers = style.layers.concat(plangebiedGrensStyleLayers, this.styleService.getTransparantlayers());
    this.resetLagen([documentId], true);
    const layer = KaartlaagUtils.getLayerByIdFromLayerGroup(this.lagen, documentId) as VectorTileLayer;

    this.mapBoxStyleService.applyStyle(layer, style, 'plan');
  }

  public resetStyleWithSelections(
    items: { locatieIds: string[]; documentId: string; symboolcode: string }[],
    kaartenImro: ImroKaartStyleConfig[]
  ): void {
    // Als er geen selectie is dan reset
    if (!items.length || !kaartenImro) {
      this.resetSelections();
      return;
    }
    // Als er niets gewijzigd is aan de selectie dan hoeft de style ook niet gewijzigd te worden
    // dit om onnodig 'flikkeren' te voorkomen

    const ids = items.map(item => item.locatieIds).flat();

    if (ids.length === this.currentIds.length && this.currentIds.every(x => ids.includes(x))) {
      return;
    }
    this.currentIds = [...ids];
    const symboolLocatiesPerPlan = new Map<string, SymboolLocatie[]>();
    items.forEach(item => {
      if (!symboolLocatiesPerPlan.has(item.documentId)) {
        symboolLocatiesPerPlan.set(item.documentId, [
          { symboolcode: item.symboolcode, locaties: item.locatieIds } as SymboolLocatie,
        ]);
      } else {
        /* als er al een symboollocatie bestaat met dezelfde symboolcode, dan moeten de locaties samengevoegd */
        const bestaandeSymboolLocatie = symboolLocatiesPerPlan
          .get(item.documentId)
          .find(symboolLocatie => symboolLocatie.symboolcode === item.symboolcode);
        if (bestaandeSymboolLocatie) {
          bestaandeSymboolLocatie.locaties = bestaandeSymboolLocatie.locaties.concat(item.locatieIds);
        } else {
          symboolLocatiesPerPlan.get(item.documentId).push({
            symboolcode: item.symboolcode,
            locaties: item.locatieIds,
          });
        }
      }
    });

    for (const planId of symboolLocatiesPerPlan.keys()) {
      let styleLookup: Style;

      if (kaartenImro?.find(k => k.naam === planId)) {
        // bestemmingsplannen
        styleLookup = kaartenImro.find(k => k.naam === planId).style;
      } else {
        // vorm vrije plannen - voorlopig alleen de eerste kaart om de plangrens te kunnen tonen
        // bij implementatie van details op locatie vormvrijeplannen - loopen over alle kaartstyles
        styleLookup = kaartenImro?.find(k => k.style.layers.length).style;
      }
      this.resetStyle(symboolLocatiesPerPlan.get(planId), planId, styleLookup);
    }
  }

  public resetStyle(symboolLocaties: SymboolLocatie[], documentId: string, styleLookup: Style): void {
    if (!styleLookup) {
      return;
    }
    const style = { ...styleLookup };
    this.resetLagen([documentId], true);
    let vectorTileLayer = KaartlaagUtils.getLayerByIdFromLayerGroup(this.lagen, documentId) as VectorTileLayer;
    const symboolCodes = symboolLocaties.map(l => l.symboolcode).filter(s => s !== undefined);
    style.layers = style.layers.filter(stylelayer => this.arrayContainsString(symboolCodes, stylelayer.id));

    const styleLayers: AnyLayer[] = [];

    // vul filter aan met locatiesIds uit symboollocaties
    style.layers.forEach(styleLayer => {
      if (styleLayer.type !== 'custom') {
        let styleLayerFilter: (string | string[])[];
        if (!styleLayer.id.includes('plangebied')) {
          const objectIds = {
            ...symboolLocaties
              .filter(s => this.stringContainsString(s.symboolcode, styleLayer.id))
              .map(sl => sl.locaties)
              .flat(),
          };
          styleLayerFilter = this.buildFilter(styleLayer.filter, objectIds);
        } else {
          styleLayerFilter = styleLayer.filter;
        }
        styleLayers.push({ ...styleLayer, filter: styleLayerFilter });
      }
    });
    style.layers = styleLayers;
    if (style.layers.length > 0) {
      style.layers = style.layers.concat(this.styleService.getTransparantlayers());
      if (!vectorTileLayer) {
        this.resetLagen([documentId], true);
        vectorTileLayer = KaartlaagUtils.getLayerByIdFromLayerGroup(this.lagen, documentId) as VectorTileLayer;
      }
      let locatieIds: string[] = [];
      symboolLocaties.forEach(sl => {
        locatieIds = locatieIds.concat(sl.locaties);
      });
      this.applyStyleBPachtigen(vectorTileLayer, style, documentId, locatieIds);
    } else {
      /* als er niets te verbeelden is, de laag verwijderen */
      this.resetLagen([documentId], false);
    }
  }

  private applyStyleBPachtigen(layer: VectorTileLayer, style: Style, documentId: string, locatieIds: string[]): void {
    /*
     * gebiedsaanduidingen (puntjes lijnen) zijn niet goed te configureren/renderen in Mapbox
     * punten en gebiedsaanduidingen worden daarom later als OlStyle geconfigureerd
     */
    this.mapBoxStyleService.applyStyle(layer, style, 'plan').then(() => {
      const styleFunction = layer.getStyle() as StyleFunction;
      layer.setStyle((feature, resolution) => {
        if (
          resolution <= this.tilegridService.getResolution(MAX_RESOLUTION) &&
          feature.get('planid') === documentId &&
          (locatieIds.length > 0 ? locatieIds.includes(feature.get('objectid')) : true)
        ) {
          /*
           * categorie en type worden in de data soms anders gebruikt, als er geen categorie is gebruik dan type
           */
          const categorie = feature.get('categorie') === undefined ? feature.get('type') : feature.get('categorie');

          return categorie === 'Gebiedsaanduiding'
            ? OlStylesConfig.IMROGEBIEDSAANDUIDINGSTYLEFUNCTION(feature, resolution)
            : styleFunction(feature, resolution);
        }
        return styleFunction(feature, resolution);
      });
    });
  }

  private buildFilter(filterFromStyle: (string | string[])[], objectIds: string[]): (string | string[])[] {
    const finalFilter: (string | string[])[] = [];
    if (filterFromStyle[0] !== 'all') {
      finalFilter.push('all', filterFromStyle as string[]);
      return finalFilter.concat(this.getObjectFilter(objectIds));
    }
    return finalFilter.concat(filterFromStyle.concat(this.getObjectFilter(objectIds)));
  }

  private getObjectFilter(objectIds: string[]): (string | string[])[] {
    const idsArray = Object.values(objectIds);
    if (idsArray.length === 1) {
      return [['==', 'objectid', objectIds[0]]];
    }
    const objectFilterArray: (string | string[])[] = [];
    objectFilterArray.push('any');
    idsArray.forEach(id => {
      objectFilterArray.push(['==', 'objectid', id]);
    });
    return [objectFilterArray] as (string | string[])[];
  }

  private arrayContainsString(symboolcodes: string[], id: string): boolean {
    if (symboolcodes.includes(id)) {
      return true;
    } else {
      let contains = false;
      symboolcodes.forEach(s => {
        if (id.includes(s) || s.includes(id)) {
          contains = true;
        }
      });
      return contains;
    }
  }
  private stringContainsString(symboolcode: string, id: string): boolean {
    return id.includes(symboolcode) || symboolcode.includes(id);
  }
}
