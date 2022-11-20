import { formattedDate, formattedDateTime, reverseDateString, toComparableNumber } from './date.utils';

describe('GroupByUtils', () => {
  describe('formattedDate', () => {
    it('should format date as dd-MM-yyyy', () => {
      const input = new Date('2021-03-01');

      expect(formattedDate(input)).toBe('01-03-2021');
    });
  });

  describe('toComparableNumber', () => {
    it('should return a date number in yyyyMMdd', () => {
      const input = new Date('2021-03-01');

      expect(toComparableNumber(input)).toBe(20210201);
    });
  });

  describe('reverseDateString', () => {
    it('should reverse a datestring', () => {
      expect(reverseDateString('11-12-2003')).toEqual('2003-12-11');
    });
  });

  describe('formattedDateTime', () => {
    it('should create a datetime string with hours and minutes in Z timezone', () => {
      const expected = '2022-12-12T12:34Z';

      expect(formattedDateTime(new Date('2022-12-12T12:34Z'))).toEqual(expected);
    });

    it('should create a datetime string with hours minutes and :00 seconds in Z timezone', () => {
      const expected = '2022-02-02T00:00:00Z';

      expect(formattedDateTime(new Date('2022-02-02'), true)).toEqual(expected);
    });
  });
});
