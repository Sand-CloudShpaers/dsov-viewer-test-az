import { Action, createReducer, on } from '@ngrx/store';
import * as FilterActions from './filter.actions';
import { FilterName, FilterOptions } from '../types/filter-options';
import { LoadingState } from '~model/loading-state.enum';

export const featureKey = 'filter';

export const initialFilterOptions: FilterOptions = {
  [FilterName.LOCATIE]: [],
  [FilterName.ACTIVITEIT]: [],
  [FilterName.THEMA]: [],
  [FilterName.DOCUMENT_TYPE]: [],
  [FilterName.REGELGEVING_TYPE]: [],
  [FilterName.REGELSBELEID]: [],
  [FilterName.GEBIEDEN]: [],
  [FilterName.DOCUMENTEN]: [],
  [FilterName.DATUM]: [],
};

export type State = {
  filterOptions: FilterOptions;
  showPanel: boolean;
  error: Error;
};

export const initialState: State = {
  filterOptions: initialFilterOptions,
  showPanel: null,
  error: null,
};
// showPanel is initieel null zodat het filter-panel-component niet gerenderd wordt
// Dit voorkomt dat de slide-animatie al optreedt bij page load

const filterReducer = createReducer(
  initialState,
  on(FilterActions.ShowFilterPanel, state => ({
    ...state,
    showPanel: true,
  })),
  on(FilterActions.HideFilterPanel, state => ({
    ...state,
    showPanel: false,
  })),
  on(FilterActions.UpdateFilters, (state, { filterOptions }) => ({
    ...state,
    filterOptions: {
      ...state.filterOptions,
      ...filterOptions,
    },
  })),
  on(FilterActions.RemoveFilter, (state, { namedFilter }) => ({
    ...state,
    filterOptions: {
      ...state.filterOptions,
      [namedFilter.name]: state.filterOptions[namedFilter.name].filter(f => f.id !== namedFilter.filter.id),
    },
  })),
  on(FilterActions.LoadLocatieFilterError, (state, { error }) => ({
    ...state,
    status: LoadingState.REJECTED,
    error,
  })),
  on(FilterActions.ResetFilters, (state, { filterNames }) => {
    const filterOptions = { ...state.filterOptions };
    filterNames.forEach(name => {
      filterOptions[name] = [];
    });
    return {
      ...state,
      filterOptions,
    };
  }),
  on(FilterActions.ResetAllFilters, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return filterReducer(state, action);
}
