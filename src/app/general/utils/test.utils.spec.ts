import { stripOl } from './test.utils';

describe('store utils', () => {
  describe('stripOl', () => {
    it('should handle undefined', () => {
      const testOlObject: any = undefined;
      stripOl(testOlObject);

      expect(testOlObject).toEqual(undefined);
    });

    it('should handle empty object', () => {
      const testOlObject: any = {};
      stripOl(testOlObject);

      expect(testOlObject).toEqual({});
    });

    it('should strip unwanted and keep wanted keys', () => {
      const testOlObject: any = {
        ol_uid: '1',
        simplifyTransformedInternal: () => {},
        listeners_: {
          change: () => {},
        },
        type: 'Polygon',
        coordinates: [
          [0, 1],
          [1, 0],
        ],
      };
      stripOl(testOlObject);

      expect(testOlObject).toEqual({
        type: 'Polygon',
        coordinates: [
          [0, 1],
          [1, 0],
        ],
      });
    });

    it('should keep non-OL keys', () => {
      const testOlObject: any = {
        key: 'value',
        otherKey: [1, 2],
        oneMoreKey: {
          nestedKey: 'value',
        },
      };
      stripOl(testOlObject);

      expect(testOlObject).toEqual({
        key: 'value',
        otherKey: [1, 2],
        oneMoreKey: {
          nestedKey: 'value',
        },
      });
    });
  });
});
