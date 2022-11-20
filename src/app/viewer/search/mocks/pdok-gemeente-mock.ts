import { PDOK } from '../types/pdok';

export const gemeenteMock: PDOK = {
  type: 'FeatureCollection',
  name: 'gemeente',
  totalFeatures: 1,
  features: [
    {
      type: 'Feature',
      id: 'gemeenten.67',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [191940.184, 508461.363],
            [191935.094, 508459.181],
            [191940.732, 508447.769],
            [191947.221, 508435.235],
            [191952.017, 508437.714],
            [191945.523, 508450.253],
            [191941.529, 508458.004],
            [191941.593, 508458.031],
            [191940.799, 508459.908],
            [191940.184, 508461.363],
          ],
        ],
      },
      geometry_name: 'geom',
      properties: {
        code: '0344',
        gemeentenaam: 'Utrecht',
      },
    },
  ],
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:EPSG::28992',
    },
  },
};
