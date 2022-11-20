import * as fromSelectors from './filter.selectors';

describe('FilterSelectors', () => {
  it('getFilterOptions', () => {
    expect(fromSelectors.getFilterOptions.projector({ filterOptions: { thema: [] } })).toEqual({ thema: [] } as any);
  });

  it('getShowPanel', () => {
    expect(fromSelectors.getShowPanel.projector({ showPanel: true })).toEqual(true);

    expect(fromSelectors.getShowPanel.projector({ showPanel: false })).toEqual(false);
  });
});
