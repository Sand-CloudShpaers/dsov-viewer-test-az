import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as themasActions from '~viewer/documenten/+state/themas/themas.actions';
import { Thema } from '~ozon-model/thema';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';

export const themasFeatureKey = 'themas';

export type State = EntityState<EntityPayload<Thema[]>>;

export const adapter = createEntityAdapter<EntityPayload<Thema[]>>({
  selectId: thema => thema.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const themaReducer = createReducer(
  initialState,
  on(themasActions.loading, (state, { document }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: document.documentId }, state)
  ),
  on(themasActions.loadSuccess, (state, { document, themas }) =>
    adapter.upsertOne({ status: LoadingState.RESOLVED, entityId: document.documentId, data: themas }, state)
  ),
  on(
    themasActions.loadFailure,
    (state, { document, error }): State =>
      adapter.upsertOne({ status: LoadingState.REJECTED, entityId: document.documentId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return themaReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
