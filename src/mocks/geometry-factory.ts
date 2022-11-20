import { LineString, MultiLineString, MultiPoint, MultiPolygon, Point, Polygon } from 'ol/geom';

export class GeometryFactory {
  public static createPoint(): Point {
    return new Point([1, 2]);
  }

  public static createPolygon(): Polygon {
    return new Polygon([
      [
        [1, 2],
        [2, 3],
        [2, 1],
        [1, 2],
      ],
    ]);
  }

  public static createMultiPolygon(): MultiPolygon {
    return new MultiPolygon([
      [
        [
          [1, 2],
          [2, 3],
          [2, 1],
        ],
      ],
      [
        [
          [3, 4],
          [4, 5],
          [4, 3],
        ],
      ],
    ]);
  }

  public static createLineString(): LineString {
    return new LineString([
      [4, 5],
      [4, 3],
      [0, 1],
    ]);
  }

  public static createMultiLineString(): MultiLineString {
    return new MultiLineString([
      [
        [4, 5],
        [4, 3],
        [0, 1],
      ],
      [
        [10, 10],
        [20, 20],
      ],
    ]);
  }

  public static createMultiPoint(): MultiPoint {
    return new MultiPoint([
      [4, 5],
      [4, 3],
    ]);
  }
}
