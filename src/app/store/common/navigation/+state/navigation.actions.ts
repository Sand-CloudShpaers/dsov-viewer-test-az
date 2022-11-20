import { createAction, props } from '@ngrx/store';
import { ViewerPage } from '~store/common/navigation/types/application-page';

export const setNavigationPath = createAction('[Navigation] Set path', props<{ page: ViewerPage; path: string }>());

export const resetNavigationPaths = createAction('[Navigation] Reset paths');
