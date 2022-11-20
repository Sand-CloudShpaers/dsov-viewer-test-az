import * as fromSelectors from './inhoud.selectors';
import { InhoudVM } from '~viewer/documenten/types/documenten.model';
import { createIhrPlanMock } from '~mocks/documenten.mock';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';

const id = 'id';

export const inhoudMock: InhoudVM = {
  onderdelen: [
    {
      type: 'bijlage bij regels',
      href: 'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/b_NL.IMRO.0983.BP201816MANRESA-VA01_rb.html',
    },
    {
      type: 'bijlage bij toelichting',
      href: 'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/b_NL.IMRO.0983.BP201816MANRESA-VA01_tb.html',
    },
    {
      type: 'toelichting',
      href: 'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/t_NL.IMRO.0983.BP201816MANRESA-VA01.html',
    },
  ],
  verwijzingNaarVaststellingsbesluit:
    'https://www.ruimtelijkeplannen.nl/documents/NL.IMRO.0983.BP201816MANRESA-VA01/vb_NL.IMRO.0983.BP201816MANRESA-VA01.pdf',
  verwijzingNaarGml: '',
  illustraties: [
    {
      type: 'illustratie',
      href: 'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/b_NL.IMRO.0983.BP201816MANRESA-VA01_rb.html',
    },
  ],
};

describe('InhoudSelectors', () => {
  describe('selectInHoud ', () => {
    it('should return inhoud from document', () => {
      expect(
        fromSelectors.selectInhoud(id).projector({
          data: { ihr: createIhrPlanMock() },
          entityId: id,
          status: 'RESOLVED',
        })
      ).toEqual(inhoudMock);
    });
  });

  describe('selectInhoudBySubpage ', () => {
    it('should return inhoud with heeftObjectgerichteTeksten', () => {
      expect(
        fromSelectors.selectInhoudBySubpage(id, DocumentSubPagePath.REGELS).projector({
          data: { ihr: createIhrPlanMock() },
          entityId: id,
          status: 'RESOLVED',
        })
      ).toEqual({
        externeReferenties: [
          'https://ruimtelijkeplannen.nl/rawdocuments/NL.IMRO.0983.BP201816MANRESA-VA01/r_NL.IMRO.0983.BP201816MANRESA-VA01.html',
        ],
        type: 'regels',
        heeftObjectgerichteTeksten: [
          {
            href: 'https://example.com/objectgericht',
            titel: 'Regels',
            type: 'regels',
          },
        ],
      });
    });

    it('should not return anything without heeftObjectgerichteTeksten', () => {
      expect(
        fromSelectors.selectInhoudBySubpage(id, DocumentSubPagePath.TOELICHTING).projector({
          data: { ihr: createIhrPlanMock() },
          entityId: id,
          status: 'RESOLVED',
        })
      ).toEqual(undefined);
    });
  });
});
