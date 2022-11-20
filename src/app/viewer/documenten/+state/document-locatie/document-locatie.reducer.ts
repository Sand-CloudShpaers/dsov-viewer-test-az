import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as DocumentLocatieActions from './document-locatie.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { LocatieMetBoundingBox } from '~ozon-model/locatieMetBoundingBox';

export const featureKey = 'documentLocatie';

export type State = EntityState<EntityPayload<LocatieMetBoundingBox>>;

export const adapter = createEntityAdapter<EntityPayload<LocatieMetBoundingBox>>({
  selectId: locatie => locatie.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const documentLocatieReducer = createReducer(
  initialState,
  on(DocumentLocatieActions.loading, (state, { documentId }) =>
    adapter.upsertOne({ status: LoadingState.PENDING, entityId: documentId }, state)
  ),
  on(DocumentLocatieActions.loadingSuccess, (state, { documentId, locatie }) =>
    adapter.upsertOne({ status: LoadingState.RESOLVED, entityId: documentId, data: locatie }, state)
  ),
  on(
    DocumentLocatieActions.loadingFailure,
    (state, { documentId, error }): State =>
      adapter.upsertOne({ status: LoadingState.REJECTED, entityId: documentId, error }, state)
  )
);

export function reducer(state: State | undefined, action: Action): State {
  return documentLocatieReducer(state, action);
}

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
