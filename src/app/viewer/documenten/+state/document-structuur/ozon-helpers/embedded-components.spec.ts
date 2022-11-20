import { DocumentComponent } from '~ozon-model/documentComponent';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';
import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { getEmbeddedComponents } from './embedded-components';

const mockElement: DocumentComponent = {
  identificatie: '',
  expressie: '',
  label: 'Artikel',
  type: DocumentBodyElementType.ARTIKEL,
  volgordeNummer: 0,
  inhoud: 'inhoud',
  _links: {
    self: {
      href: '',
    },
    isOnderdeelVan: {
      href: '',
    },
  },
};

const mockOntwerpElement: OntwerpDocumentComponent = {
  ...mockElement,
  geregistreerdMet: {
    versie: null,
    tijdstipRegistratie: null,
    eindRegistratie: null,
    status: null,
  },
  _embedded: {
    ontwerpDocumentComponenten: [],
  },
};

describe('EmbeddedComponents', () => {
  describe('getEmbeddedComponents', () => {
    it('should return empty list, when no element', () => {
      expect(getEmbeddedComponents(null)).toEqual([]);
    });

    it('should return empty list, when no embedded', () => {
      expect(getEmbeddedComponents(mockElement)).toEqual([]);
    });

    it('should return empty list, when no embedded components', () => {
      expect(
        getEmbeddedComponents({
          ...mockElement,
          geregistreerdMet: {
            versie: null,
            tijdstipRegistratie: null,
            eindRegistratie: null,
            status: null,
          },
          _embedded: {},
        })
      ).toEqual([]);
    });

    it('should return embedded documentComponenten', () => {
      expect(
        getEmbeddedComponents({
          ...mockElement,
          _embedded: {
            documentComponenten: [mockElement],
          },
        })
      ).toEqual([mockElement]);
    });

    it('should return embedded documentComponenten, when ontwerp', () => {
      expect(
        getEmbeddedComponents({
          ...mockElement,
          geregistreerdMet: {
            versie: null,
            tijdstipRegistratie: null,
            eindRegistratie: null,
            status: null,
          },
          _embedded: {
            ontwerpDocumentComponenten: [mockOntwerpElement],
          },
        })
      ).toEqual([mockOntwerpElement]);
    });
  });
});
