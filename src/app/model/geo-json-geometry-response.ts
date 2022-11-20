export interface GeoJsonGeometryResponse {
  projection?: {
    dataProjection: string;
    featureProjection: string;
  };
  coordinates?: Coordinates;
  type: GeoJsonGeometryType;
}

type GeoJsonGeometryType =
  | 'Point'
  | 'Polygon'
  | 'MultiPolygon'
  | 'LineString'
  | 'MultiPoint'
  | 'MultiLineString'
  | 'GeometryCollection';

type Coordinates = number[] | number[][] | number[][][] | number[][][][];
