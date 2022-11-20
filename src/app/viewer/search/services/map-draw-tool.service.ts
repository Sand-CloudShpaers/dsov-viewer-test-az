import { Injectable } from '@angular/core';
import GeometryType from 'ol/geom/GeometryType';
import { Draw } from 'ol/interaction';
import { Collection } from 'ol';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { Drawing } from '~model/internal/drawing';
import { MapColorsConfig } from '~general/utils/map-colors.config';

@Injectable({
  providedIn: 'root',
})
export class MapDrawToolService {
  constructor(private kaartService: KaartService) {}

  public drawOnMap(geometryType: string): Drawing {
    const draw = new Draw(
      geometryType === GeometryType.POINT
        ? {
            features: new Collection(),
            type: geometryType,
            style: MapColorsConfig.DRAW_POINT,
          }
        : {
            features: new Collection(),
            type: geometryType,
            style: MapColorsConfig.DRAW,
          }
    );
    this.kaartService.getMap().removeInteraction(draw);
    this.kaartService.getMap().addInteraction(draw);
    return { draw, map: this.kaartService.getMap(), ready: false, geometryType };
  }
}
