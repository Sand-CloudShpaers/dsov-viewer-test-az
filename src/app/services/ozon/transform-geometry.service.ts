import { Injectable } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { Geometry } from 'ol/geom';
import { GeoJSONGeometry } from '~ihr-model/geoJSONGeometry';

@Injectable({ providedIn: 'root' })
export class TransformGeometryService {
  public static transformGeometrieToOlGeometry(geometrie: GeoJSONGeometry): Geometry {
    return new GeoJSON().readGeometry(geometrie);
  }
}
