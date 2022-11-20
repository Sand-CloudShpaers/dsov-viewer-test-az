import { getLastPathSegment, getQueryParamSeparator } from '~general/utils/uri.utils';

describe('uri utils', () => {
  describe('getLastPathSegment', () => {
    it('should return empty string if url empty', () => {
      expect(getLastPathSegment('')).toEqual('');
    });

    it('should return last segement', () => {
      expect(getLastPathSegment('klm/abc?x=y')).toEqual('abc');
    });
  });

  describe('getQueryParamSeparator', () => {
    it('should return a questionmark if a questionmark is not present in the url', () => {
      expect(getQueryParamSeparator('aksjkasoaow')).toEqual('?');
    });

    it('should return a ampersand if a questionmark is present in the url', () => {
      expect(getQueryParamSeparator('aksjkasoaow?x=y')).toEqual('&');
    });
  });
});
