import { sortByKey, sortGroupByKeys } from './group-by.utils';

describe('GroupByUtils', () => {
  it('sortByKey', () => {
    const input = [
      { waarde: 'B' },
      { waarde: 'a' },
      { waarde: 'F' },
      { waarde: 'c' },
      { waarde: 'en een langere titel' },
      { waarde: 'D' },
      { waarde: '1' },
    ];

    expect(sortByKey(input, 'waarde')).toEqual([
      { waarde: '1' },
      { waarde: 'a' },
      { waarde: 'B' },
      { waarde: 'c' },
      { waarde: 'D' },
      { waarde: 'en een langere titel' },
      { waarde: 'F' },
    ]);
  });

  it('sortGroupByKeys', () => {
    const content = [{ a: '1' }, { b: 2 }, { c: [3, 4] }];
    const input = {
      B: content,
      a: content,
      F: content,
      c: content,
      'en een lange key': content,
      D: content,
      '1': content,
    };

    expect(sortGroupByKeys<any>(input)).toEqual({
      '1': content,
      a: content,
      B: content,
      c: content,
      D: content,
      'en een lange key': content,
      F: content,
    } as any);
  });
});
