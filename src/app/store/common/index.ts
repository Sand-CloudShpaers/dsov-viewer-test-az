import * as fromOzonLocaties from '~store/common/ozon-locaties/+state/ozon-locaties.reducer';
import * as fromReleaseNotes from '~viewer/release-notes/+state/release-notes.reducer';
import * as fromSelection from '~store/common/selection/+state/selection.reducer';
import * as fromNavigation from '~store/common/navigation/+state/navigation.reducer';
import * as fromVersions from '~store/common/application-info/+state/application-info.reducer';
import * as fromHighlight from '~store/common/highlight/+state/highlight.reducer';
import * as fromRoot from '~store/state';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

export const commonRootKey = 'common';

export interface CommonState {
  readonly [fromOzonLocaties.ozonLocatiesRootKey]: fromOzonLocaties.State;
  readonly [fromSelection.selectionFeatureKey]: fromSelection.State;
  readonly [fromReleaseNotes.releaseNotesFeatureKey]: fromReleaseNotes.State;
  readonly [fromNavigation.navigationFeatureKey]: fromNavigation.State;
  readonly [fromVersions.featureKey]: fromVersions.State;
  readonly [fromHighlight.featureKey]: fromHighlight.State;
}

export interface State extends fromRoot.State {
  readonly [commonRootKey]: CommonState;
}

export function reducers(state: CommonState | undefined, action: Action): CommonState {
  return combineReducers({
    [fromOzonLocaties.ozonLocatiesRootKey]: fromOzonLocaties.reducer,
    [fromSelection.selectionFeatureKey]: fromSelection.reducer,
    [fromReleaseNotes.releaseNotesFeatureKey]: fromReleaseNotes.reducer,
    [fromNavigation.navigationFeatureKey]: fromNavigation.reducer,
    [fromVersions.featureKey]: fromVersions.reducer,
    [fromHighlight.featureKey]: fromHighlight.reducer,
  })(state, action);
}

export const selectCommonState = createFeatureSelector<CommonState>(commonRootKey);
