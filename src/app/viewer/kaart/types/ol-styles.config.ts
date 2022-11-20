import { Fill, Icon, Stroke, Style } from 'ol/style';
import { FeatureLike } from 'ol/Feature';
import { Geometry, LinearRing, LineString, Polygon } from 'ol/geom';
import Point from 'ol/geom/Point';
import GeometryLayout from 'ol/geom/GeometryLayout';
import { zIndices } from '~viewer/kaart/services/kaart.service';

export class OlStylesConfig {
  private static pointStylesCache = new Map<string, Style[]>();
  private static currentCachedPlanId: string;

  public static readonly ZOEK_LOCATIE = new Style({
    fill: new Fill({
      color: 'rgba(204,204,204, 0.25)',
    }),
    stroke: new Stroke({
      color: 'rgba(139, 74, 106, 1)',
      width: 3,
    }),
  });

  public static readonly ZOEK_LOCATIE_MARKER = new Style({
    image: new Icon({
      src: 'assets/images/location-outline.png',
      anchor: [0.5, 1],
    }),
  });

  public static readonly PIN = new Style({
    image: new Icon({
      src: 'assets/images/Pin2x.png',
      scale: 0.5,
      anchor: [0.5, 1],
    }),
  });

  public static readonly HIGHLIGHT = new Style({
    fill: new Fill({
      color: 'rgba(255,255,255, 0.5)',
    }),
    stroke: new Stroke({
      color: '#CE3F51',
      width: 3,
    }),
  });

  public static readonly TRANSPARANT = new Style({
    fill: new Fill({
      color: 'transparent',
    }),
    stroke: new Stroke({
      color: 'transparent',
      width: 2,
    }),
    image: new Icon({
      src: 'assets/images/highlightmarker.svg',
      opacity: 0,
    }),
  });

  public static readonly HIGHLIGHTMARKER = new Style({
    image: new Icon({
      src: 'assets/images/highlightmarker.svg',
    }),
  });

  public static readonly IMROGEBIEDSAANDUIDINGSTYLEFUNCTION = function (
    feature: FeatureLike,
    resolution: number
  ): Style[] {
    const collectPointsFromLine = function (line: LineString): Point[] {
      const iconPoints: Point[] = [];
      const fractionSize = 2 / (line.getLength() / (resolution * 10));

      for (let fraction = 0; fraction < 1; fraction += fractionSize) {
        iconPoints.push(new Point(line.getCoordinateAt(fraction)));
      }
      return iconPoints;
    };

    const createPointStylesFromPoints = function (points: Point[], color: string): Style[] {
      const pointStyles = [];
      for (let i = 0; i < points.length; i++) {
        let previouspoint, nextpoint;
        const point = points[i];
        if (i === 0) {
          previouspoint = points[points.length - 1];
        } else {
          previouspoint = points[i - 1];
        }
        if (i === points.length - 1) {
          nextpoint = points[0];
        } else {
          nextpoint = points[i + 1];
        }
        const dx = previouspoint.getCoordinates()[0] - nextpoint.getCoordinates()[0];
        const dy = previouspoint.getCoordinates()[1] - nextpoint.getCoordinates()[1];
        const rotation = Math.atan2(dy, dx);
        pointStyles.push(
          new Style({
            geometry: point,
            image: new Icon({
              src: 'assets/images/gebiedsaand.png',
              anchor: [0.5, 0.5],
              rotation: -rotation,
              scale: 0.35,
              color: color,
            }),
            zIndex: zIndices.ImroGebiedsaanduidingen,
          })
        );
      }
      return pointStyles;
    };

    const getGeomHash = function (geom: LineString): string {
      const coords = geom.getFlatCoordinates();
      if (!coords) {
        return '';
      }
      return coords.join('|');
    };

    const addToPointStylesCache = function (key: string, pointStyles: Style[], planId: string): void {
      if (planId !== OlStylesConfig.currentCachedPlanId) {
        OlStylesConfig.currentCachedPlanId = planId;
        OlStylesConfig.pointStylesCache.clear();
      }
      OlStylesConfig.pointStylesCache.set(key, pointStyles);
    };

    const getPointStyles = function (ring: LinearRing, planId: string): Style[] {
      const line = new LineString(ring.getFlatCoordinates(), GeometryLayout.XY);
      const geomHash = getGeomHash(line);
      const key = `${geomHash}|${resolution}`;
      const found = OlStylesConfig.pointStylesCache.get(key);
      if (found) {
        return found;
      } else {
        const iconPoints = collectPointsFromLine(line);
        const pointStyles = createPointStylesFromPoints(iconPoints, zoneColor);
        if (geomHash !== undefined) {
          addToPointStylesCache(key, pointStyles, planId);
        }
        return pointStyles;
      }
    };

    const styles: Style[] = [];
    let zoneColor = '#ffffff';
    const categorie = feature.get('categorie') === undefined ? feature.get('type') : feature.get('categorie');
    if (resolution < 14 && categorie === 'Gebiedsaanduiding') {
      const classficatie = feature.get('classificatie');
      switch (classficatie) {
        case 'geluidzone':
          zoneColor = '#ff9b00';
          break;
        case 'luchtvaartverkeerzone':
          zoneColor = '#9b32cd';
          break;
        case 'vrijwaringszone':
          zoneColor = '#37cd00';
          break;
        case 'veiligheidszone':
          zoneColor = '#0000ff';
          break;
        case 'milieuzone':
          zoneColor = '#009b00';
          break;
        case 'wro-zone':
          zoneColor = '#ff0000';
          break;
        case 'wetgevingzone':
          zoneColor = '#ff0000';
          break;
        case 'reconstructiewetzone':
          zoneColor = '#38855e';
          break;
        case 'overige zone':
          zoneColor = '#646464';
          break;
        case 'overig':
          zoneColor = '#646464';
          break;
        default:
      }
      const geometry = feature.getGeometry();
      // MultiPolygonen worden gestyled als Polygon
      // LineStrings worden gestyled met alleen een lijn

      // Geen 'haaientanden' wanneer resolutie meer dan 5
      if (geometry.getType() === 'Polygon' && resolution < 5) {
        const polygon = geometry as Polygon;
        const resultPolygon = new Polygon(polygon.getFlatCoordinates(), GeometryLayout.XY, polygon.getEnds());

        resultPolygon
          .getLinearRings()
          .forEach(ring => styles.push(...getPointStyles(ring, geometry.getProperties().planid)));
      }

      if (geometry.getType() === 'Point') {
        styles.push(
          new Style({
            geometry: geometry as Geometry,
            image: new Icon({
              src: 'assets/images/gebiedsaand_punt.png',
              anchor: [0.5, 0.5],
              scale: 0.3,
            }),
            zIndex: zIndices.ImroGebiedsaanduidingen,
          })
        );
      }

      styles.push(
        new Style({
          geometry: geometry as Geometry,
          stroke: new Stroke({
            color: zoneColor,
            width: 1.5,
          }),
          zIndex: zIndices.ImroGebiedsaanduidingen,
        })
      );
    }
    // transparent style zodat gebiedsaanduidingen aanklikbaar blijven
    styles.push(OlStylesConfig.TRANSPARANT);

    return styles;
  };
}
