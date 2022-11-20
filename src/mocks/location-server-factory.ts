import GeoJSON from 'ol/format/GeoJSON';

export class LocationServerFactory {
  public static createParcelResponse(): any {
    const fc = {
      type: 'FeatureCollection',
      totalFeatures: 1,
      features: [
        {
          type: 'Feature',
          id: 'perceel.7774494',
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [1, 2],
                [2, 3],
                [2, 4],
                [1, 2],
              ],
            ],
          },
          geometry_name: 'begrenzingperceel',
          properties: {},
        },
      ],
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::28992',
        },
      },
    };
    return new GeoJSON().readFeatures(fc);
  }

  public static createGemeenteShortenedResponse(): any {
    return {
      geometrie_ll: 'MULTIPOLYGON(((1 2, 2 3, 3 4, 1 2)))',
      type: 'gemeente',
      provincienaam: 'Friesland',
      weergavenaam: 'Gemeente X',
      geometrie_rd: 'MULTIPOLYGON(((1 2, 2 3, 3 4, 1 2)))',
      id: 'gem-0123',
      gemeentenaam: 'Vlieland',
    };
  }

  public static createAddresShortenedResponse(): any {
    return {
      gekoppeld_perceel: ['xxx01-y-100'],
      huis_nlt: '123',
      geometrie_ll: 'POINT(1 2)',
      type: 'adres',
      weergavenaam: 'Laan Y',
      geometrie_rd: 'POINT(1 2)',
      id: 'adr-0123',
      gemeentenaam: 'test gemeente',
    };
  }
}
