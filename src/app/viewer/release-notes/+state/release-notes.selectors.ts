import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectCommonState, State } from '~store/common/index';
import * as fromReleaseNotes from './release-notes.reducer';
import { ReleaseNotesVM } from '~viewer/release-notes/types/release-notes.model';

const getReleaseNotesState = createSelector(selectCommonState, state => state[fromReleaseNotes.releaseNotesFeatureKey]);

const { selectEntities: selectReleaseNotesEntities } = fromReleaseNotes.adapter.getSelectors(getReleaseNotesState);

export const getReleaseNotesVM = (id: string): MemoizedSelector<State, ReleaseNotesVM> =>
  createSelector(selectReleaseNotesEntities, entities => entities[id]?.data?.releaseNotes);
