import * as fromSearch from './search.reducer';
import { SearchMode } from '~viewer/search/types/search-mode';
import { State } from '~store/state';

export const getSearchMode = (state: State): SearchMode => state[fromSearch.searchKey].searchMode;
