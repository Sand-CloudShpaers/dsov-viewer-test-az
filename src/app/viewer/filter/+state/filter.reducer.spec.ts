import { FilterName } from '../types/filter-options';
import * as FilterActions from './filter.actions';
import { initialState, reducer as filterReducer } from './filter.reducer';

describe('FilterReducer', () => {
  const themaFilter = { thema: [{ id: 'themafiler', name: 'Thema Filter' }] };

  it('should have initial state', () => {
    const action = {};
    const actual = filterReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should show filterpaneel', () => {
    const action = FilterActions.ShowFilterPanel();
    const actual = filterReducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      showPanel: true,
    });
  });

  it('should hide filterpaneel', () => {
    const action = FilterActions.HideFilterPanel();
    const actual = filterReducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      showPanel: false,
    });
  });

  it('should set and remove filters', () => {
    const setAction = FilterActions.UpdateFilters({ filterOptions: themaFilter });
    let actual = filterReducer(initialState, setAction);

    expect(actual).toEqual({
      ...initialState,
      filterOptions: { ...initialState.filterOptions, ...themaFilter },
    });

    const removeAction = FilterActions.ResetFilters({
      filterNames: [FilterName.THEMA],
    });
    actual = filterReducer(initialState, removeAction);

    expect(actual).toEqual(initialState);
  });

  it('should reset all filters', () => {
    const action = FilterActions.ResetAllFilters({});
    const actual = filterReducer(initialState, action);

    expect(actual).toEqual(initialState);
  });
});
