import { Injectable } from '@angular/core';
import VectorTileLayer from 'ol/layer/VectorTile';
import BaseLayer from 'ol/layer/Base';
import { KaartlaagFactoryService } from './kaartlaag-factory.service';
import { KaartlaagConfiguratie } from '../types/kaartlaag-configuratie';
import { MapboxStyleService } from '~viewer/kaart/services/helpers/mapbox-style.service';
import { zIndices } from '~viewer/kaart/services/kaart.service';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { Style } from 'mapbox-gl';
import { Verbeelding } from '~ozon-model-verbeelden/verbeelding';
import { ActivatedRoute } from '@angular/router';
import { isTimeTravelLayer } from '~viewer/filter/helpers/filters';

@Injectable({
  providedIn: 'root',
})
export class OmgevingsdocumentlagenService {
  private config: KaartlaagConfiguratie[];
  private defaultLayer: VectorTileLayer;
  private timeTravelLayer: VectorTileLayer;

  constructor(
    private route: ActivatedRoute,
    private layerFactoryService: KaartlaagFactoryService,
    private mapboxStyleService: MapboxStyleService
  ) {}

  public initDefault(): BaseLayer {
    this.config = this.layerFactoryService.layerConfigFormat.omgevingsdocumentlagen;

    this.defaultLayer = null;
    this.defaultLayer = this.layerFactoryService.initializeLayer(this.config[0]) as VectorTileLayer;
    return this.defaultLayer;
  }

  public initTimeTravel(): BaseLayer {
    this.config = this.layerFactoryService.layerConfigFormat.omgevingsdocumentlagen;

    this.timeTravelLayer = null;
    this.timeTravelLayer = this.layerFactoryService.initializeLayer(this.config[1]) as VectorTileLayer;
    return this.timeTravelLayer;
  }

  public set(verbeelding: Verbeelding, selections: Selection[], isTimeTravel: boolean): void {
    if (!verbeelding?.mapboxstyle) {
      this.defaultLayer?.setVisible(false);
      this.timeTravelLayer?.setVisible(false);
      return;
    }

    this.pushToLayer(verbeelding, selections, isTimeTravel);
  }

  private pushToLayer(verbeelding: Verbeelding, selections: Selection[], isTimeTravel: boolean): void {
    const mapboxStyle = verbeelding.mapboxstyle as Style;

    const timeTravelLayer = isTimeTravelLayer(this.route.snapshot.queryParams) || isTimeTravel;

    // Loop over all items in selected annotations
    selections.forEach(item => {
      if (item.objectType === SelectionObjectType.OMGEVINGSNORM_NORMWAARDE && item.name) {
        // Find the symbology that matches the selected item
        const symbool = verbeelding.symboolmetadata.find(element => element.identificator === item.id);
        symbool?.locaties?.forEach(locatie => {
          const sourceLayers = timeTravelLayer
            ? ['vlaklocaties_totaal', 'lijnlocaties_totaal', 'puntlocaties_totaal']
            : ['vlaklocaties', 'lijnlocaties', 'puntlocaties'];

          sourceLayers.forEach(sourceLayer => {
            // Create mapbox style layer for each location in the symbology object
            mapboxStyle.layers.push({
              id: `label_${item.id}_${locatie.identificatie}`,
              type: 'symbol',
              source: 'omgevingsdocument',
              'source-layer': sourceLayer,
              layout: {
                'text-field': item.name,
                'text-font': ['Asap semi-bold'],
                'text-size': 12,
                'text-anchor': 'top',
              },
              paint: {
                'text-halo-color': 'rgba(255,255,255, 1)',
                'text-halo-width': 2,
                // Place labels under the icon for point locations
                'text-translate': ['puntlocaties', 'puntlocaties_totaal'].includes(sourceLayer) ? [0, 15] : [0, 0],
              },
              filter: ['all', ['==', 'identificatie', locatie.identificatie], ['==', 'versie', locatie.versie]],
            });
          });
        });
      }
    });

    const layer = timeTravelLayer ? this.timeTravelLayer : this.defaultLayer;
    this.mapboxStyleService.applyStyle(layer, mapboxStyle, 'omgevingsdocument').then(() => {
      // set z-index to make sure that labels are displayed under zoekgebied
      layer.setZIndex(zIndices.OmgevingsdocumentLagen);
      layer.setVisible(mapboxStyle.layers.length > 0);
    });
  }
}
