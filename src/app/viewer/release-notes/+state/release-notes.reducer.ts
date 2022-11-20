import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { EntityPayload } from '~general/utils/state/entity-action';
import { ReleaseNotesVM } from '~viewer/release-notes/types/release-notes.model';
import * as ReleaseNotesActions from './release-notes.actions';
import { LoadingState } from '~model/loading-state.enum';

export const releaseNotesEntityId = 'release-notes';
export const releaseNotesFeatureKey = 'release-notes';

export type State = EntityState<EntityPayload<{ releaseNotes: ReleaseNotesVM }>>;

export const adapter = createEntityAdapter<EntityPayload<{ releaseNotes: ReleaseNotesVM }>>({
  selectId: () => releaseNotesEntityId,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const releaseNotesReducer = createReducer(
  initialState,

  on(ReleaseNotesActions.loadReleaseNotes, state =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: releaseNotesEntityId }, state)
  ),

  on(ReleaseNotesActions.loadReleaseNotesSuccess, (state, { releaseNotes }) =>
    adapter.upsertOne(
      { status: LoadingState.RESOLVED, entityId: releaseNotesEntityId, data: { releaseNotes: releaseNotes } },
      state
    )
  ),

  on(ReleaseNotesActions.loadReleaseNotesFailure, (state, { error }) =>
    adapter.upsertOne({ status: LoadingState.REJECTED, entityId: releaseNotesEntityId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return releaseNotesReducer(state, action);
}
