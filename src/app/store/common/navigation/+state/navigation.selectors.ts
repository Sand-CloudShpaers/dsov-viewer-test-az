import { createSelector } from '@ngrx/store';
import { selectCommonState } from '~store/common';
import * as fromNavigation from './navigation.reducer';

export const getNavigationState = createSelector(
  selectCommonState,
  state => state[fromNavigation.navigationFeatureKey]
);

export const selectNavigationPaths = createSelector(getNavigationState, state => state);
