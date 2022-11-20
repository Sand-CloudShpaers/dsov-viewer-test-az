import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EntityPayload } from '~general/utils/state/entity-action';
import { ImroPlanResponse } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import * as kaartenImroActions from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.actions';

export const kaartenImroFeatureKey = 'kaarten-imro';

export type State = EntityState<EntityPayload<ImroPlanResponse>>;

export const adapter = createEntityAdapter<EntityPayload<ImroPlanResponse>>({
  selectId: imrokaarten => imrokaarten.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const kaartenImroReducer = createReducer(
  initialState,
  on(kaartenImroActions.loadingStyleConfigs, (state, { documentId }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: documentId }, state)
  ),
  on(
    kaartenImroActions.loadStyleConfigsFailure,
    kaartenImroActions.loadStylesFailure,
    (state, { documentIds, error }): State =>
      adapter.upsertMany(
        documentIds.map(id => ({
          status: LoadingState.REJECTED,
          entityId: id,
          error,
        })),
        state
      )
  ),
  on(
    kaartenImroActions.loadStylesSuccess,
    (state, { configs }): State =>
      adapter.upsertMany(
        configs.map(config => ({
          status: LoadingState.RESOLVED,
          entityId: config.id,
          data: config,
        })),
        state
      )
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return kaartenImroReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
