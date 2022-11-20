import { createAction, props } from '@ngrx/store';
import { SearchMode } from '~viewer/search/types/search-mode';

export const setSearchMode = createAction('[Search] set SearchMode', props<{ searchMode: SearchMode }>());
