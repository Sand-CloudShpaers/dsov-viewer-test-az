import { DocumentComponent } from '~ozon-model/documentComponent';
import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { getPrefix, getSuffix, getTitle } from './element-title';

const mockElement: DocumentComponent = {
  identificatie: '',
  expressie: '',
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

describe('ElementTitle', () => {
  describe('getPrefix', () => {
    it('should return "ik gebruik het label"', () => {
      expect(
        getPrefix({ ...mockElement, label: 'ik gebruik het label', type: DocumentBodyElementType.DIVISIE })
      ).toEqual('ik gebruik het label');
    });

    it('should return empty string', () => {
      expect(getPrefix({ ...mockElement, type: DocumentBodyElementType.DIVISIE })).toEqual('');
    });

    it('should return empty string, when element is LID', () => {
      expect(getPrefix({ ...mockElement, type: DocumentBodyElementType.LID })).toEqual('');
    });

    it('should return §', () => {
      expect(getPrefix({ ...mockElement, type: DocumentBodyElementType.PARAGRAAF })).toEqual('§');
    });

    it('should return ARTIKEL', () => {
      expect(getPrefix(mockElement)).toEqual(DocumentBodyElementType.ARTIKEL);
    });
  });

  describe('getTitle', () => {
    it('should return opschrift, with prefix and nummer', () => {
      expect(getTitle({ ...mockElement, opschrift: 'opschrift', nummer: '1' })).toEqual('opschrift');
      expect(getPrefix({ ...mockElement, opschrift: 'opschrift', nummer: '1' })).toEqual('ARTIKEL');
    });

    it('should return opschrift, with nummer', () => {
      expect(
        getTitle({
          ...mockElement,
          label: null,
          type: DocumentBodyElementType.DIVISIE,
          opschrift: 'opschrift',
          nummer: '1',
        })
      ).toEqual('opschrift');
    });

    it('should return opschrift, with gereserveerd', () => {
      expect(getTitle({ ...mockElement, opschrift: 'opschrift', gereserveerd: true })).toEqual('opschrift');
      expect(getPrefix({ ...mockElement, gereserveerd: true })).toEqual('ARTIKEL');
      expect(getSuffix({ ...mockElement, gereserveerd: true })).toEqual('[gereserveerd]');
    });

    it('should return vervallen', () => {
      expect(getSuffix({ ...mockElement, vervallen: true })).toEqual('[vervallen]');
    });

    it('should return opschrift, with only gereserveerd', () => {
      expect(getTitle({ ...mockElement, gereserveerd: true })).toEqual('');
      expect(getPrefix({ ...mockElement, gereserveerd: true })).toEqual('ARTIKEL');
      expect(getSuffix({ ...mockElement, gereserveerd: true })).toEqual('[gereserveerd]');
    });

    it('should return empty opschrift, when type is LID', () => {
      expect(getTitle({ ...mockElement, label: null, type: DocumentBodyElementType.LID, nummer: '1' })).toEqual('');
    });
  });

  describe('getBijlageTitle', () => {
    it('should return bijlage, with nummer en opschrift', () => {
      expect(
        getTitle({
          ...mockElement,
          label: 'Bijlage',
          type: DocumentBodyElementType.BIJLAGE,
          opschrift: 'BIJ HOOFDSTUK 2 VAN DEZE REGELING',
          nummer: 'III',
        })
      ).toEqual('BIJ HOOFDSTUK 2 VAN DEZE REGELING');
    });
  });
});
