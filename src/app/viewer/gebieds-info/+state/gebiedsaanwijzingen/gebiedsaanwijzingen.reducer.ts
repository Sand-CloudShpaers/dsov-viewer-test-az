import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { EntityPayload } from '~general/utils/state/entity-action';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen.actions';
import { GebiedsaanwijzingenEmbedded } from '~ozon-model/gebiedsaanwijzingenEmbedded';

export const gebiedsaanwijzingenFeatureKey = 'gebiedsaanwijzingen';
export const entityId = 'gebiedsaanwijzingen';

export type State = EntityState<EntityPayload<GebiedsaanwijzingenEmbedded>>;

export const adapter = createEntityAdapter<EntityPayload<GebiedsaanwijzingenEmbedded>>({
  selectId: gebiedsaanwijzingen => gebiedsaanwijzingen.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const gebiedsaanwijzingenReducer = createReducer(
  initialState,
  on(GebiedsaanwijzingenActions.loadGebiedsaanwijzingen, state =>
    adapter.upsertOne({ entityId, status: LoadingState.PENDING }, state)
  ),
  on(GebiedsaanwijzingenActions.loadGebiedsaanwijzingenSuccess, (state, { gebiedsaanwijzingen }) =>
    adapter.upsertOne(
      {
        entityId,
        data: gebiedsaanwijzingen,
        status: LoadingState.RESOLVED,
      },
      state
    )
  ),
  on(GebiedsaanwijzingenActions.loadGebiedsaanwijzingenFailure, (state, { error }) =>
    adapter.upsertOne({ entityId, status: LoadingState.REJECTED, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return gebiedsaanwijzingenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
