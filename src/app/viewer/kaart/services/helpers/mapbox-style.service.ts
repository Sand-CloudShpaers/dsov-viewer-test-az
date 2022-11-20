import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import { applyStyle } from 'ol-mapbox-style';
import { renderTransparent } from 'ol-mapbox-style/dist/stylefunction';
import { CircleLayer, FillLayer, LineLayer, Style } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapboxStyleService {
  constructor() {
    renderTransparent(true);
  }

  public applyStyle(
    layer: BaseLayer,
    glStyle: Style,
    source: string | string[],
    path?: string,
    resolutions?: number[]
  ): Promise<unknown> {
    return applyStyle(layer, glStyle, source, path, resolutions);
  }

  public getTransparantlayers(): [FillLayer, LineLayer, CircleLayer] {
    return [
      {
        id: 'transparant_vlak',
        type: 'fill',
        source: 'plan',
        'source-layer': 'planobject_polygon',
        paint: {
          'fill-color': 'transparent',
        },
      },
      {
        id: 'transparant_lijn',
        type: 'line',
        source: 'plan',
        'source-layer': 'planobject_linestring',
        paint: {
          'line-color': 'transparent',
          'line-width': 3,
        },
      },
      {
        id: 'transparant_point',
        type: 'circle',
        source: 'plan',
        'source-layer': 'planobject_point',
        paint: {
          'circle-radius': 5,
          'circle-color': 'transparent',
        },
      },
    ];
  }
}
