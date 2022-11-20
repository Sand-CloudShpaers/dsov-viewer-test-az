import Feature from 'ol/Feature';
import { Extent } from 'ol/extent';
import { Coordinate } from 'ol/coordinate';
import { fromExtent } from 'ol/geom/Polygon';
import * as helpers from '@turf/helpers';
import kinks from '@turf/kinks';
import { flatMap } from './array.utils';
import {
  Geometry,
  GeometryCollection,
  LinearRing,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'ol/geom';
import GeometryType from 'ol/geom/GeometryType';
import _default from 'ol/geom/GeometryType';
import GeoJSON, { GeoJSONGeometry, GeoJSONGeometryCollection } from 'ol/format/GeoJSON';
import * as jsts from 'jsts';
import GeometryLayout from 'ol/geom/GeometryLayout';
import { setMaxDecimalsUsingFloor } from '~general/utils/math.utils';
import POLYGON = _default.POLYGON;
import GEOMETRY_COLLECTION = _default.GEOMETRY_COLLECTION;

export const MAX_DECIMALS_ETRS89 = 8;
export const MAX_DECIMALS_RD = 3;

// max extent moet groot genoeg zijn om (rekening houdend met de resolutionconstraint setting)
// altijd nl + het continentale plat in beeld te krijgen
export enum MaxExtent {
  MIN_X = -500000,
  MIN_Y = 0,
  MAX_X = 800000,
  MAX_Y = 1000000,
}

export class GeoUtils {
  public static getGeometryFromFeatures(features: Feature<Geometry>[]): Geometry {
    // Filter features without geometry
    const featureList = features.filter(feature => feature.getGeometry() !== undefined);

    const geometries = featureList.map(feature => feature.getGeometry());
    if (geometries.length > 1) {
      return new GeometryCollection(geometries);
    }
    return geometries[0];
  }

  public static getCoordinatesFromOlGeometry(
    geometry: Geometry
  ): Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][] {
    if (
      geometry instanceof Point ||
      geometry instanceof MultiPoint ||
      geometry instanceof LineString ||
      geometry instanceof MultiLineString ||
      geometry instanceof LinearRing ||
      geometry instanceof Polygon ||
      geometry instanceof MultiPolygon
    ) {
      return geometry.getCoordinates();
    }
    if (geometry instanceof GeometryCollection) {
      return this.getGeometriesFromCollection(geometry);
    } else {
      return [];
    }
  }

  public static getBufferGeometry(geometry: Geometry): GeoJSONGeometry {
    // de buffer berekening is een tijdelijke oplossing
    return new GeoJSON().writeGeometryObject(GeoUtils.bufferedGeometry(geometry, -1));
  }

  public static bufferedGeometry(geometry: Geometry, bufferDistance: number): Geometry {
    if (![GeometryType.POLYGON, GeometryType.MULTI_POLYGON].includes(geometry.getType())) {
      return geometry;
    }
    const parser = new jsts.io.OL3Parser();
    // Do not remove these. We are only using it for (multi-)polygon, but internally all types are needed
    parser.inject(
      Point,
      LineString,
      LinearRing,
      Polygon,
      MultiPoint,
      MultiLineString,
      MultiPolygon,
      GeometryCollection
    );
    const jstsGeometry = parser.read(geometry);
    return parser.write(jstsGeometry.buffer(bufferDistance));
  }

  public static intersectionWithExtent(geometry: Geometry, extent: Extent): Geometry {
    const parser = new jsts.io.OL3Parser();
    parser.inject(
      Point,
      LineString,
      LinearRing,
      Polygon,
      MultiPoint,
      MultiLineString,
      MultiPolygon,
      GeometryCollection
    );
    const jstGeometry = parser.read(geometry);
    const jstExtent = parser.read(fromExtent(extent));
    const intersection = jstGeometry.intersection(jstExtent);
    return parser.write(intersection);
  }

  public static isValid(geometry: Geometry): boolean {
    const coordinates = GeoUtils.getCoordinatesFromOlGeometry(geometry) as Coordinate[][];
    if (geometry.getType() === GeometryType.POLYGON) {
      // Check for 'kinks' (self-intersections)
      if (kinks(helpers.polygon(coordinates)).features.length > 0) {
        return false;
      }
    }
    return this.isArea(coordinates[0]);
  }

  // input coordinates is array of points, with each point an 2 dimensional array
  // method checks whether the coordinates are describing an area
  public static isArea(coordinates: number[][]): boolean {
    let isArea = false;
    let x1: number;
    let x2: number;
    let y1: number;
    let y2: number;
    let dx: number;
    let dy: number;
    const slope: number[] = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      x1 = coordinates[i][0];
      y1 = coordinates[i][1];
      x2 = coordinates[i + 1][0];
      y2 = coordinates[i + 1][1];

      dx = x2 - x1;
      dy = y2 - y1;
      if (dx === 0) {
        slope[i] = Number.MAX_VALUE;
      } else {
        slope[i] = dy / dx;
      }
      if (i > 0) {
        if (slope[i] !== slope[i - 1] && slope[i] !== Number.MAX_VALUE && slope[i - 1] !== Number.MAX_VALUE) {
          isArea = true;
          break;
        }
      }
    }
    return isArea;
  }

  public static getInverseGeometries(geometries: Geometry[]): Geometry {
    // maak de inverseGeometrie groter dan de maxExtent, dan zijn de buiten grenzen
    // niet zichtbaar op de kaart
    const inversePolygon = new Polygon([
      [
        [MaxExtent.MIN_X - 100000, MaxExtent.MIN_Y - 100000],
        [MaxExtent.MIN_X - 100000, MaxExtent.MAX_Y + 100000],
        [MaxExtent.MAX_X + 100000, MaxExtent.MAX_Y + 100000],
        [MaxExtent.MAX_X + 100000, MaxExtent.MIN_Y - 100000],
        [MaxExtent.MIN_X - 100000, MaxExtent.MIN_Y - 100000],
      ],
    ]);
    geometries.forEach(geometry => {
      GeoUtils.getRings(geometry).forEach(ring => {
        inversePolygon.appendLinearRing(ring);
      });
    });
    return inversePolygon;
  }

  public static roundCoordinates(
    geoJson: GeoJSONGeometry | GeoJSONGeometryCollection
  ): GeoJSONGeometry | GeoJSONGeometryCollection {
    // Afronden van coördinaten met floor ipv round ivm problemen invalide geometrieën

    return JSON.parse(JSON.stringify(geoJson), (key, value) =>
      typeof value === 'number' ? setMaxDecimalsUsingFloor(value, MAX_DECIMALS_RD) : value
    );
  }

  public static addVerticesToGeometry(geometry: Geometry, maxVerticeLength: number): Geometry {
    if (geometry.getType() === POLYGON) {
      return GeoUtils.addVerticesToPolygon(geometry as Polygon, maxVerticeLength);
    } else if (geometry.getType() === GEOMETRY_COLLECTION) {
      return GeoUtils.addVerticesToGeometryCollection(geometry as GeometryCollection, maxVerticeLength);
    }
    return geometry;
  }

  private static addVerticesToGeometryCollection(
    coll: GeometryCollection,
    maxVerticeLength: number
  ): GeometryCollection {
    const resultCollectionArray: Geometry[] = [];
    coll.getGeometries().forEach(geom => {
      if (geom.getType() === POLYGON) {
        resultCollectionArray.push(GeoUtils.addVerticesToPolygon(geom as Polygon, maxVerticeLength));
      }
      return new GeometryCollection().setGeometries(resultCollectionArray);
    });
    return coll;
  }

  private static addVerticesToPolygon(polygon: Polygon, maxVerticeLength: number): Polygon {
    const poly = new Polygon(polygon.getFlatCoordinates(), GeometryLayout.XY, polygon.getEnds());
    const resultPolygon = new Polygon([]);
    poly.getLinearRings().forEach(ring => {
      resultPolygon.appendLinearRing(GeoUtils.addPointsToRing(ring, maxVerticeLength));
    });
    return resultPolygon;
  }

  private static addPointsToRing(ring: LinearRing, maxVerticeLength: number): LinearRing {
    const line = new LineString(ring.getFlatCoordinates(), GeometryLayout.XY);
    const coords = GeoUtils.collectCoordinatesFromLine(line, maxVerticeLength);
    return new LinearRing(coords);
  }

  private static collectCoordinatesFromLine(line: LineString, maxVerticeLength: number): Coordinate[] {
    const coords: Coordinate[] = [];
    line.forEachSegment((eerste, laatste) => {
      const segment = new LineString([eerste, laatste]);
      if (segment.getLength() > maxVerticeLength) {
        const fractionSize = 1 / (segment.getLength() / maxVerticeLength);
        for (let fraction = 0; fraction < 1; fraction += fractionSize) {
          const x = Math.round(segment.getCoordinateAt(fraction)[0] * 1000) / 1000;
          const y = Math.round(segment.getCoordinateAt(fraction)[1] * 1000) / 1000;
          coords.push([x, y]);
        }
      } else {
        coords.push(segment.getCoordinates()[0]);
      }
    });
    // laatste coords van line toevoegen
    coords.push(line.getCoordinates().pop());
    return coords;
  }

  private static getGeometriesFromCollection(
    geometryCollection: GeometryCollection
  ): Coordinate | Coordinate[] | Coordinate[][] | Coordinate[][][] {
    const geometries = geometryCollection.getGeometries();
    return flatMap(geometries, geometry => this.getCoordinatesFromOlGeometry(geometry) as Coordinate[]);
  }

  private static getRings(geom: Geometry): LinearRing[] {
    let rings: LinearRing[] = [];
    if (geom instanceof Polygon) {
      rings = rings.concat(geom.getLinearRings());
    }
    if (geom instanceof MultiPolygon) {
      geom.getPolygons().forEach(polygon => {
        rings = rings.concat(polygon.getLinearRings());
      });
    }
    return rings;
  }
}
