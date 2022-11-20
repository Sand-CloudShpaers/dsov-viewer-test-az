import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as OmgevingsnormenActions from './omgevingsnormen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { LoadingState } from '~model/loading-state.enum';
import { Omgevingsnorm } from '~ozon-model/omgevingsnorm';

export const omgevingsnormenFeatureKey = 'omgevingsnormen';
export const entityId = 'omgevingsnormen';

export type State = EntityState<EntityPayload<Omgevingsnorm[]>>;

export const adapter = createEntityAdapter<EntityPayload<Omgevingsnorm[]>>({
  selectId: omgevingsnormen => omgevingsnormen.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const omgevingsnormenReducer = createReducer(
  initialState,
  on(OmgevingsnormenActions.loadingOmgevingsnormen, state =>
    adapter.upsertOne({ entityId, status: LoadingState.PENDING }, state)
  ),
  on(OmgevingsnormenActions.loadOmgevingsnormenSuccess, (state, { omgevingsnormen }) =>
    adapter.upsertOne(
      {
        entityId,
        data: omgevingsnormen,
        status: LoadingState.RESOLVED,
      },
      state
    )
  ),
  on(OmgevingsnormenActions.loadOmgevingsnormenFailure, (state, { error }) =>
    adapter.upsertOne({ entityId, status: LoadingState.REJECTED, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return omgevingsnormenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
