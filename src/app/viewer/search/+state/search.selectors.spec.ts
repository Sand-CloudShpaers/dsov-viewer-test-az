import { LoadingState } from '~model/loading-state.enum';
import initialState from '~mocks/initial-state';
import { searchKey } from '~store/state';
import { SearchMode } from '~viewer/search/types/search-mode';
import * as fromSelectors from './search.selectors';

const state = {
  ...initialState,
  [searchKey]: {
    searchMode: SearchMode.LOCATIE,
    status: LoadingState.RESOLVED,
    error: {
      name: 'name',
      message: 'bericht',
    },
  },
} as any;

describe('SearchSelectors', () => {
  describe('getSearchMode', () => {
    it('should return search mode', () => {
      expect(fromSelectors.getSearchMode(state)).toEqual(SearchMode.LOCATIE);
    });
  });
});
