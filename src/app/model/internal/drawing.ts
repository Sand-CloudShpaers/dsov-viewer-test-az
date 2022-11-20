import Map from 'ol/Map';
import Draw from 'ol/interaction/Draw';

export interface Drawing {
  draw: Draw;
  map: Map;
  ready: boolean;
  geometryType: string;
}
