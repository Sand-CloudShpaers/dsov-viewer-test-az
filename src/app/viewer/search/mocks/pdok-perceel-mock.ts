import { PDOK } from '../types/pdok';

export const perceelMock: PDOK = {
  type: 'FeatureCollection',
  name: 'perceel',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::28992' } },
  features: [
    {
      type: 'Feature',
      id: '28431393-fb40-4c69-91e0-f2bcb00c9d1b',
      properties: {
        identificatieNamespace: 'NL.IMKAD.KadastraalObject',
        identificatieLokaalID: '66030768070000',
        beginGeldigheid: '2017-03-27T16:17:24.000',
        tijdstipRegistratie: '2017-03-27T16:17:24.000',
        volgnummer: 0,
        statusHistorieCode: 'G',
        statusHistorieWaarde: 'Geldig',
        kadastraleGemeenteCode: '460',
        kadastraleGemeenteWaarde: 'IJsselmuiden',
        sectie: 'B',
        AKRKadastraleGemeenteCodeCode: '509',
        AKRKadastraleGemeenteCodeWaarde: 'ISM02',
        kadastraleGrootteWaarde: 144.0,
        soortGrootteCode: '1',
        soortGrootteWaarde: 'Vastgesteld',
        perceelnummer: 7680,
        perceelnummerRotatie: 1.0,
        perceelnummerVerschuivingDeltaX: 0.0,
        perceelnummerVerschuivingDeltaY: 0.0,
        perceelnummerPlaatscoordinaatX: 191940.976,
        perceelnummerPlaatscoordinaatY: 508453.388,
      },
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
    },
  ],
};
