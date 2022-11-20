import { ApiUtils } from '~general/utils/api.utils';

describe('ApiUtils', () => {
  describe('isOzonDocument', () => {
    it('should check isOzonDocument', () => {
      expect(ApiUtils.isOzonDocument('NIET.IMRO.test')).toBeTruthy();
      expect(ApiUtils.isOzonDocument('_akn_nl_bill_')).toBeTruthy();
      expect(ApiUtils.isOzonDocument('/akn/nl/act/blabla')).toBeTruthy();
      expect(ApiUtils.isOzonDocument('NL.IMRO.test')).toBeFalse();
    });
  });

  describe('isIhrDocument', () => {
    it('should check isIhrDocument', () => {
      expect(ApiUtils.isIhrDocument('NL.IMRO.test')).toBeTruthy();
      expect(ApiUtils.isIhrDocument('NIET.IMRO.test')).toBeFalse();
    });
  });

  describe('isRegeling', () => {
    it('should check isRegeling', () => {
      expect(ApiUtils.isRegeling('/akn/nl/act/12345')).toBeTruthy();
      expect(ApiUtils.isRegeling('NL.IMRO.test')).toBeFalse();
    });
  });

  describe('isOntwerpRegeling', () => {
    it('should check isRegeling', () => {
      expect(ApiUtils.isOntwerpRegeling('_akn_nl_bill_')).toBeTruthy();
      expect(ApiUtils.isOntwerpRegeling('/akn/nl/act/12345')).toBeFalse();
    });
  });

  describe('isOmgevingsvergunning', () => {
    it('should check isOmgevingsvergunning', () => {
      expect(ApiUtils.isOmgevingsvergunning('gm0599/Vergunning1234VGAfw1_01')).toBeTruthy();
      expect(ApiUtils.isOmgevingsvergunning('/akn/nl/act/blabla')).toBeFalse();
    });
  });

  describe('addTimeTravelAsQueryParamStringForOzon', () => {
    it('should return ozon url with geldigOp, inWerkingOp and beschikbaarOp', () => {
      const expected =
        'https://www.example.com/?geldigOp=2022-02-02&inWerkingOp=2022-02-02&beschikbaarOp=2022-02-02T23%3A59%3A59Z';

      expect(
        ApiUtils.addTimeTravelAsQueryParamStringForOzon('https://www.example.com', { geldigOp: '2022-02-02' })
      ).toEqual(expected);
    });

    it('should return ozon url with synchroniseerMetTileSet parameter when timeTravelDate is not present', () => {
      expect(ApiUtils.addTimeTravelAsQueryParamStringForOzon('https://www.example.com', null)).toEqual(
        'https://www.example.com/?synchroniseerMetTileSet=normaal'
      );
    });

    it('should return ozon url with synchroniseerMetTileSet=volledig when searching', () => {
      expect(ApiUtils.addTimeTravelAsQueryParamStringForOzon('https://www.example.com/_suggesties', null)).toEqual(
        'https://www.example.com/_suggesties?synchroniseerMetTileSet=volledig'
      );
    });

    it('should return ozon url without geldigOp, inWerkingOp and beschikbaarOp for ontwerp-endpoints but with synchorniseerMetTileSet', () => {
      expect(
        ApiUtils.addTimeTravelAsQueryParamStringForOzon('https://www.example.com/ontwerp', { geldigOp: '2022-03-06' })
      ).toEqual('https://www.example.com/ontwerp?synchroniseerMetTileSet=normaal');
    });

    it('should return ozon url without geldigOp, inWerkingOp and beschikbaarOp and without synchorniseerMetTileSet', () => {
      expect(
        ApiUtils.addTimeTravelAsQueryParamStringForOzon('https://www.example.com/app-info', {
          geldigOp: '2022-03-06',
        })
      ).toEqual('https://www.example.com/app-info');
    });
  });
});
