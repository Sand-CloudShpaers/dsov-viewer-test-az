import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as bekendmakingenActions from '~viewer/documenten/+state/bekendmakingen/bekendmakingen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { BekendmakingCollectie } from '~ihr-model/bekendmakingCollectie';

export const bekendmakingenFeatureKey = 'bekendmakingen';

export type State = EntityState<EntityPayload<BekendmakingCollectie>>;

export const adapter = createEntityAdapter<EntityPayload<BekendmakingCollectie>>({
  selectId: bekendmaking => bekendmaking.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const bekendmakingenReducer = createReducer(
  initialState,
  on(bekendmakingenActions.loading, (state, { documentId }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: documentId }, state)
  ),
  on(bekendmakingenActions.loadIhrBekendmakingenSuccess, (state, { documentId, data }) =>
    adapter.upsertOne({ status: LoadingState.RESOLVED, entityId: documentId, data }, state)
  ),
  on(
    bekendmakingenActions.loadIhrBekendmakingenFailure,
    (state, { documentId, error }): State =>
      adapter.upsertOne({ status: LoadingState.REJECTED, entityId: documentId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return bekendmakingenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
