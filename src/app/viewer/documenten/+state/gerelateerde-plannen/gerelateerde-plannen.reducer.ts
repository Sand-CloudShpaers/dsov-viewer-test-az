import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EntityPayload } from '~general/utils/state/entity-action';
import { Action, createReducer, on } from '@ngrx/store';
import * as gerelateerdePlannenActions from '~viewer/documenten/+state/gerelateerde-plannen/gerelateerde-plannen.actions';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { GerelateerdPlan } from '~ihr-model/gerelateerdPlan';
import { Plan } from '~ihr-model/plan';

export const gerelateerdePlannenFeatureKey = 'gerelateerde-plannen';

export interface GerelateerdePlannenEntity {
  gerelateerdePlannen: GerelateerdPlan[];
  gerelateerdVanuit: GerelateerdPlan[];
  dossier: Plan[];
}

export type State = EntityState<EntityPayload<GerelateerdePlannenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<GerelateerdePlannenEntity>>({
  selectId: gerelateerdPlan => gerelateerdPlan.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const gerelateerdePlannenReducer = createReducer(
  initialState,
  on(gerelateerdePlannenActions.loading, (state, { documentId }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: documentId }, state)
  ),
  on(gerelateerdePlannenActions.loadGerelateerdePlannenSuccess, (state, { documentId, entity }) =>
    adapter.upsertOne({ status: LoadingState.RESOLVED, entityId: documentId, data: entity }, state)
  ),
  on(
    gerelateerdePlannenActions.loadGerelateerdePlannenFailure,
    (state, { documentId, error }): State =>
      adapter.upsertOne({ status: LoadingState.REJECTED, entityId: documentId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return gerelateerdePlannenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
