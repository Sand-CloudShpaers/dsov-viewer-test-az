import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { EntityPayload } from '~general/utils/state/entity-action';
import { Kaart } from '~ozon-model/kaart';
import { LoadingState } from '~model/loading-state.enum';
import * as KaartenActions from './kaarten.actions';

export const kaartenFeatureKey = 'kaarten';

export type State = EntityState<EntityPayload<Kaart[]>>;

export const adapter = createEntityAdapter<EntityPayload<Kaart[]>>({
  selectId: kaarten => kaarten.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const kaartenReducer = createReducer(
  initialState,
  on(KaartenActions.loadKaarten, (state, { documentId }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: documentId }, state)
  ),
  on(KaartenActions.loadKaartenSuccess, (state, { documentId, kaarten }) =>
    adapter.upsertOne(
      {
        entityId: documentId,
        data: kaarten,
        status: LoadingState.RESOLVED,
      },
      state
    )
  ),
  on(
    KaartenActions.loadKaartenFailure,
    (state, { documentId, error }): State =>
      adapter.upsertOne({ status: LoadingState.REJECTED, entityId: documentId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return kaartenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
