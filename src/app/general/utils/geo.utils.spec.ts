import Polygon from 'ol/geom/Polygon';
import { GeoUtils } from './geo.utils';
import GeoJSON, { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { GeometryCollection } from 'ol/geom';

describe('geoUtils', () => {
  it('point is no area', () => {
    const coordinates = [[0, 0]];

    expect(GeoUtils.isArea(coordinates)).toBeFalsy();
  });

  it('line is no area', () => {
    const coordinates = [
      [0, 0],
      [1, 2],
    ];

    expect(GeoUtils.isArea(coordinates)).toBeFalsy();
  });

  it('vertical line is no area', () => {
    const coordinates = [
      [0, 0],
      [0, 1],
    ];

    expect(GeoUtils.isArea(coordinates)).toBeFalsy();
  });

  it('horizontal line is no area', () => {
    const coordinates = [
      [1, 0],
      [0, 1],
    ];

    expect(GeoUtils.isArea(coordinates)).toBeFalsy();
  });

  it('polygon is area', () => {
    const coordinates = [
      [0, 0],
      [1, 2],
      [3, 4],
    ];

    expect(GeoUtils.isArea(coordinates)).toBeTruthy();
  });

  it('multi polygon is area', () => {
    const coordinates = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [2, 0],
      [2, 1],
      [3, 1],
      [3, 0],
    ];

    expect(GeoUtils.isArea(coordinates)).toBeTruthy();
  });

  it('self-intersection', () => {
    const geometry = new Polygon([
      [
        [1, 1],
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    ]);

    expect(GeoUtils.isValid(geometry as any)).toBeFalsy();
  });

  it('no self-intersection', () => {
    const geometry = new Polygon([
      [
        [2, 1],
        [1, 0],
        [0, 0],
        [0, 1],
        [2, 1],
      ],
    ]);

    expect(GeoUtils.isValid(geometry as any)).toBeTruthy();
  });

  it('roundCoordinates should round with 3 decimals using floor', () => {
    const mockPolygon: GeoJSONGeometry = new GeoJSON().writeGeometryObject(
      new Polygon([
        [
          [1.1236, 2.1234],
          [2, 3],
          [2, 1],
          [1.1236, 2.1234],
        ],
      ])
    );
    const expected: GeoJSONGeometry = new GeoJSON().writeGeometryObject(
      new Polygon([
        [
          [1.123, 2.123],
          [2, 3],
          [2, 1],
          [1.123, 2.123],
        ],
      ])
    );
    const actual = GeoUtils.roundCoordinates(mockPolygon);

    expect(actual).toEqual(expected);
  });

  it('Should insert vertices in polygon', () => {
    const polygon = new Polygon([
      [
        [0, 0],
        [0, 100],
        [100, 100],
        [100, 0],
        [0, 0],
      ],
    ]);
    const expected = new Polygon([
      [
        [0, 0],
        [0, 50],
        [0, 100],
        [50, 100],
        [100, 100],
        [100, 50],
        [100, 0],
        [50, 0],
        [0, 0],
      ],
    ]);
    const actual = GeoUtils.addVerticesToGeometry(polygon, 50) as Polygon;

    expect(actual.getCoordinates()).toEqual(expected.getCoordinates());
  });

  it('Should not insert vertices in polygon', () => {
    const polygon = new Polygon([
      [
        [0, 0],
        [0, 100],
        [100, 100],
        [100, 0],
        [0, 0],
      ],
    ]);

    const actual = GeoUtils.addVerticesToGeometry(polygon, 105) as Polygon;

    expect(actual.getCoordinates()).toEqual(polygon.getCoordinates());
  });

  it('Should insert vertices in geometrycollection', () => {
    const polygon = new Polygon([
      [
        [0, 0],
        [0, 100],
        [100, 100],
        [100, 0],
        [0, 0],
      ],
    ]);
    const geometryCollection = new GeometryCollection([polygon, polygon]);

    const resultPoly = new Polygon([
      [
        [0, 0],
        [0, 50],
        [0, 100],
        [50, 100],
        [100, 100],
        [100, 50],
        [100, 0],
        [50, 0],
        [0, 0],
      ],
    ]);

    const expected = new GeometryCollection([resultPoly, resultPoly]);

    const actual = GeoUtils.addVerticesToGeometry(geometryCollection, 50) as GeometryCollection;

    expect(actual.getGeometries().length).toEqual(expected.getGeometries().length);
    expect(actual.getGeometries()[0].getExtent()).toEqual(expected.getGeometries()[0].getExtent());
  });
});
