import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as LocatiesActions from './locaties.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { LocatiesEntity } from '~viewer/annotaties/types/entity';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const locatiesRootKey = 'locaties';

export type State = EntityState<EntityPayload<LocatiesEntity>>;

export const adapter = createEntityAdapter<EntityPayload<LocatiesEntity>>({
  selectId: locaties => locaties.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const locatiesReducer = createReducer(
  initialState,
  on(LocatiesActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(LocatiesActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(LocatiesActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return locatiesReducer(state, action);
}
