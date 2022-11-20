import { setMaxDecimalsUsingFloor } from '~general/utils/math.utils';

describe('math.utils', () => {
  describe('setDecimals', () => {
    it('should set the maximum number of decimals to the default value of 1', () => {
      expect(setMaxDecimalsUsingFloor(1.1)).toEqual(1.1);
      expect(setMaxDecimalsUsingFloor(1.19)).toEqual(1.1);
      expect(setMaxDecimalsUsingFloor(1.199999999)).toEqual(1.1);
    });

    it('should set the maximum number of decimals to the value of 2 ', () => {
      expect(setMaxDecimalsUsingFloor(1.1, 2)).toEqual(1.1);
      expect(setMaxDecimalsUsingFloor(1.19, 2)).toEqual(1.19);
      expect(setMaxDecimalsUsingFloor(1.1999999999, 2)).toEqual(1.19);
    });
  });
});
