import { Action, createReducer, on } from '@ngrx/store';
import * as SearchActions from './search.actions';
import { SearchMode } from '~viewer/search/types/search-mode';

export const searchKey = 'search';

export type State = {
  searchMode: SearchMode;
};

export const initialState: State = {
  searchMode: SearchMode.LOCATIE,
};

const searchReducer = createReducer(
  initialState,

  on(SearchActions.setSearchMode, (state, { searchMode }) => ({
    ...state,
    searchMode: searchMode,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return searchReducer(state, action);
}
