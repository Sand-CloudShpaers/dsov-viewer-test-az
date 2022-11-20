import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as hoofdlijnenActions from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { HoofdlijnenEntity } from './hoofdlijnen.model';

export const hoofdlijnFeatureKey = 'hoofdlijnen';

export type State = EntityState<EntityPayload<HoofdlijnenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<HoofdlijnenEntity>>({
  selectId: hoofdlijn => hoofdlijn.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const hoofdlijnenReducer = createReducer(
  initialState,
  on(hoofdlijnenActions.loadingHoofdlijnen, (state, { document }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: document.documentId }, state)
  ),
  on(hoofdlijnenActions.loadHoofdlijnenSuccess, (state, { documentId, vastgesteld, ontwerp }) =>
    adapter.upsertOne(
      {
        status: LoadingState.RESOLVED,
        entityId: documentId,
        data: {
          documentId: documentId,
          vastgesteld,
          ontwerp,
        },
      },
      state
    )
  ),
  on(
    hoofdlijnenActions.loadHoofdlijnenFailure,
    (state, { documentId, error }): State =>
      adapter.upsertOne({ status: LoadingState.REJECTED, entityId: documentId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return hoofdlijnenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
