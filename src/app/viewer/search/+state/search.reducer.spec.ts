import { initialState, reducer as searchReducer, State } from './search.reducer';
import * as SearchActions from './search.actions';
import { SearchMode } from '~viewer/search/types/search-mode';

const setModeState: State = {
  searchMode: SearchMode.DOCUMENT,
} as State;

describe('searchReducer', () => {
  describe('initial state', () => {
    it('should have initial state', () => {
      const action = {};
      const actual = searchReducer(undefined, action as any);

      expect(actual).toEqual(initialState);
    });
  });

  describe('setSearchMode', () => {
    it('should set searchMode in store', () => {
      const action = SearchActions.setSearchMode({
        searchMode: SearchMode.DOCUMENT,
      });
      const actual = searchReducer(initialState, action as any);

      expect(actual).toEqual(setModeState);
    });
  });
});
