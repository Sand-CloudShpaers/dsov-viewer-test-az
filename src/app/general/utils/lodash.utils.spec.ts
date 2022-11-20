import { mergeObjectOrArray } from '~general/utils/lodash.utils';

describe('mergeObjectOrArray', () => {
  it('should merge objects and arrays', () => {
    expect(mergeObjectOrArray({ b: [4] }, { a: 1, b: [2] })).toEqual({ a: 1, b: [4, 2] });
  });
});
