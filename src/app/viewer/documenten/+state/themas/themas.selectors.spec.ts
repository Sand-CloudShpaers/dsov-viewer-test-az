import { createRegelingMock } from '~mocks/documenten.mock';
import * as fromSelectors from './themas.selectors';
import { Thema } from '~ozon-model/thema';

const id = '/akn/nl/act/gm0983/2020/OOWVVVReg';
export const themasMock: Thema[] = [
  {
    code: '001',
    waarde: 'Thema 1',
  },
  {
    code: '002',
    waarde: 'Thema 2',
  },
  {
    code: '003',
    waarde: 'Thema 3',
  },
];

describe('Themas Selectors', () => {
  describe('selectThemasByDocumentId ', () => {
    it('should return empty array on undefined or empty selectThemaEntities', () => {
      expect(fromSelectors.selectThemasByDocumentId(id).projector({}, {})).toEqual([]);
    });

    it('should return themas with same selectedDocumentId', () => {
      expect(
        fromSelectors.selectThemasByDocumentId(id).projector(
          {
            '/akn/nl/act/gm0983/2020/OOWVVVReg': {
              data: themasMock,
              entityId: id,
              status: 'RESOLVED',
            },
          },
          {
            data: createRegelingMock({ identificatie: id }),
            entityId: id,
            status: 'RESOLVED',
          }
        )
      ).toEqual(themasMock);
    });

    it('should return themas with same selectedDocumentId 2 (different set)', () => {
      expect(
        fromSelectors.selectThemasByDocumentId(`${id}_anders`).projector(
          {
            '/akn/nl/act/gm0983/2020/OOWVVVReg': {
              data: themasMock,
              entityId: id,
              status: 'RESOLVED',
            },
            '/akn/nl/act/gm0983/2020/OOWVVVReg_anders': {
              data: [{ code: '1_afwijkend', waarde: '1_afwijkend' }],
              entityId: id,
              status: 'RESOLVED',
            },
          },
          {
            data: createRegelingMock({ identificatie: `${id}_anders` }),
            entityId: `${id}_anders`,
            status: 'RESOLVED',
          }
        )
      ).toEqual([{ code: '1_afwijkend', waarde: '1_afwijkend' }]);
    });
  });
});
