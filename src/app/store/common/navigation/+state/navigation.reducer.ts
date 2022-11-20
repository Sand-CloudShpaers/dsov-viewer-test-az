import { Action, createReducer, on } from '@ngrx/store';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import * as NavigationActions from './navigation.actions';

export const navigationFeatureKey = 'navigations';

export type State = NavigationPaths;

export const initialState: State = {
  [ViewerPage.OVERZICHT]: null,
  [ViewerPage.ACTIVITEITEN]: null,
  [ViewerPage.GEBIEDEN]: null,
  [ViewerPage.DOCUMENTEN]: null,
  [ViewerPage.REGELSOPMAAT]: null,
  [ViewerPage.DOCUMENT]: null,
  [ViewerPage.THEMAS]: null,
};

const navigationReducer = createReducer(
  initialState,
  on(NavigationActions.setNavigationPath, (state, { page, path }) => ({ ...state, [page]: path })),
  on(NavigationActions.resetNavigationPaths, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return navigationReducer(state, action);
}
