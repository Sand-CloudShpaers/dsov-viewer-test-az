import * as fromSelectors from './hoofdlijnen.selectors';
import {
  mockHoofdlijnen,
  mockHoofdlijnenResponse,
  mockOntwerpHoofdlijnenResponse,
} from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.mock';

const id = '/akn/nl/act/gm0983/2020/OOWVVVReg';

describe('Hoofdlijn Selectors', () => {
  describe('selectHoofdlijnenByDocumentId ', () => {
    it('should return empty array on undefined or empty selectHoofdlijnenEntities', () => {
      expect(fromSelectors.selectHoofdlijnenByDocumentId(id).projector({}, {})).toEqual({});
    });

    it('should return hoofdlijnen with same selectedDocumentId', () => {
      expect(
        fromSelectors.selectHoofdlijnenByDocumentId(id).projector({
          [id]: {
            data: {
              documentId: id,
              vastgesteld: mockHoofdlijnenResponse,
              ontwerp: mockOntwerpHoofdlijnenResponse,
            },
            entityId: id,
            status: 'RESOLVED',
          },
        })
      ).toEqual({
        ['Doelstelling']: [
          {
            identificatie: 'nl.imow-gm0983.hoofdlijn.VRKOVhfst1',
            naam: 'hfst 1',
            soort: 'Doelstelling',
            isOntwerp: false,
          },
          {
            identificatie: 'nl.imow-gm0983.hoofdlijn.VRKOVhfst1',
            naam: 'hfst 1',
            soort: 'Doelstelling',
            isOntwerp: true,
          },
        ],
      });
    });

    it('should not return hoofdlijnen with other selectedDocumentId', () => {
      expect(
        fromSelectors.selectHoofdlijnenByDocumentId(`${id}_anders`).projector({
          '/akn/nl/act/gm0983/2020/OOWVVVReg': {
            data: mockHoofdlijnen,
            entityId: id,
            status: 'RESOLVED',
          },
        })
      ).toEqual({});
    });
  });
});
