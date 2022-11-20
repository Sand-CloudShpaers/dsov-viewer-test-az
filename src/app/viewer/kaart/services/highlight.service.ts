import { KaartService, zIndices } from '~viewer/kaart/services/kaart.service';
import VectorTileLayer from 'ol/layer/VectorTile';
import Style from 'ol/style/Style';
import { OlStylesConfig } from '~viewer/kaart/types/ol-styles.config';
import { Injectable } from '@angular/core';
import { KaartlaagUtils } from '~viewer/kaart/utils/kaartlaag-utils';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { KaartlaagConfiguratie } from '~viewer/kaart/types/kaartlaag-configuratie';
import { MapboxStyleService } from './helpers/mapbox-style.service';
import { Verbeelding } from '~ozon-model-verbeelden/verbeelding';
import { CircleLayer, Style as MapboxStyle } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class HighlightService {
  constructor(
    public kaartService: KaartService,
    public layerFactoryService: KaartlaagFactoryService,
    private olMapboxStyleService: MapboxStyleService
  ) {}

  public addHighlightLayerOzon(verbeelding: Verbeelding, isTimeTravel: boolean): void {
    this.removeHighlightLayer();
    const config: KaartlaagConfiguratie =
      this.layerFactoryService.layerConfigFormat.omgevingsdocumentlagen[isTimeTravel ? 1 : 0];
    const layer: VectorTileLayer = this.layerFactoryService.initializeLayer(config) as VectorTileLayer;
    layer.setProperties({ id: 'highlight' });
    if (!verbeelding) {
      layer.setVisible(false);
      return;
    }
    const style = this.setHighlightSymbology(verbeelding.mapboxstyle as MapboxStyle);
    this.kaartService.getMap().addLayer(layer);
    this.olMapboxStyleService.applyStyle(layer, style, 'omgevingsdocument').then(() => {
      layer.setVisible(true);
      layer.setZIndex(zIndices.HighlightLaag);
    });
  }

  public addHighlightLayerIHR(documentId: string, locatieIds: string[]): void {
    this.removeHighlightLayer();
    const config: KaartlaagConfiguratie = this.layerFactoryService.layerConfigFormat.ruimtelijkeplannenlagen;
    const layer = this.layerFactoryService.initializeLayer(config, documentId) as VectorTileLayer;

    layer.setProperties({ id: 'highlight' });
    layer.setStyle(function (feature): Style[] {
      if (feature.get('layer') === 'planobject_point' && locatieIds.includes(feature.get('objectid'))) {
        return [OlStylesConfig.HIGHLIGHTMARKER];
      }
      if (
        locatieIds.includes(feature.get('objectid')) ||
        (feature.get('planid') === locatieIds && feature.get('layer') === 'plangebied')
      ) {
        return [OlStylesConfig.HIGHLIGHT];
      }
      return [];
    });
    layer.setVisible(true);
    layer.setZIndex(zIndices.HighlightLaag);
    this.kaartService.getMap().addLayer(layer);
  }

  public removeHighlightLayer(): void {
    const layer = KaartlaagUtils.getLayerByIdFromMap(this.kaartService.getMap(), 'highlight') as VectorTileLayer;
    this.kaartService.getMap().removeLayer(layer);
  }

  private setHighlightSymbology(style: MapboxStyle): MapboxStyle {
    style.layers.forEach(layer => {
      // gebruik de eerste regelingsgebiedgrenslaag voor de highlight vlakvulling
      if (layer.id === 'regelingsgebied-grens1') {
        layer.type = 'fill';
      }
      if (layer.type === 'fill') {
        layer.paint = {
          'fill-opacity': 0.5,
          'fill-color': '#FFFFFF',
        };
        layer.layout = undefined;
      } else if (layer.type === 'line') {
        layer.paint = {
          'line-color': '#CE3F51',
          'line-width': 3,
        };
      } else if (layer.type === 'symbol') {
        // Convert to circle for symbol highlight
        layer = layer as unknown as CircleLayer;
        layer.type = 'circle';
        layer.paint = {
          'circle-radius': 3,
          'circle-color': '#FFFFFF',
          'circle-stroke-color': '#FF0000',
          'circle-stroke-width': 2,
        };
        layer.layout = undefined;
      }
      return layer;
    });
    return style;
  }
}
