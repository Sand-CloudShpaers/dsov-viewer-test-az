import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';

export const featureCollectionPerceelResponse = {
  type: 'FeatureCollection',
  numberMatched: 1,
  name: 'perceel',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::28992',
    },
  },
  features: [
    {
      type: 'Feature',
      id: '2ec4e588-e187-f81b-79ce-c607b8175a0d',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1, 2],
            [2, 3],
            [2, 1],
            [1, 2],
          ],
        ],
      },
    },
  ],
};

export const featureCollectionVerblijfsobjectResponse = {
  type: 'FeatureCollection',
  name: 'verblijfsobject',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::28992',
    },
  },
  features: [] as Feature<Geometry>[],
};
