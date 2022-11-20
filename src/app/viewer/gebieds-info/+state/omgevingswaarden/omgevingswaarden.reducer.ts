import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as OmgevingswaardenActions from './omgevingswaarden.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { LoadingState } from '~model/loading-state.enum';
import { Omgevingswaarde } from '~ozon-model/omgevingswaarde';

export const omgevingswaardenFeatureKey = 'omgevingswaarden';
export const entityId = 'omgevingswaarden';

export type State = EntityState<EntityPayload<Omgevingswaarde[]>>;

export const adapter = createEntityAdapter<EntityPayload<Omgevingswaarde[]>>({
  selectId: omgevingswaarden => omgevingswaarden.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const omgevingswaardenReducer = createReducer(
  initialState,
  on(OmgevingswaardenActions.loadOmgevingswaarden, state =>
    adapter.upsertOne({ entityId, status: LoadingState.PENDING }, state)
  ),
  on(OmgevingswaardenActions.loadOmgevingswaardenSuccess, (state, { omgevingswaarden }) =>
    adapter.upsertOne(
      {
        entityId,
        data: omgevingswaarden,
        status: LoadingState.RESOLVED,
      },
      state
    )
  ),
  on(OmgevingswaardenActions.loadOmgevingswaardenFailure, (state, { error }) =>
    adapter.upsertOne({ entityId, status: LoadingState.REJECTED, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return omgevingswaardenReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
