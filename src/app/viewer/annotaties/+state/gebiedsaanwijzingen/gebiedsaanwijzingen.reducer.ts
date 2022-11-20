import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { GebiedsaanwijzingenEntity } from '~viewer/annotaties/types/entity';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const gebiedsaanwijzingenRootKey = 'gebiedsaanwijzingen';

export type State = EntityState<EntityPayload<GebiedsaanwijzingenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<GebiedsaanwijzingenEntity>>({
  selectId: gebiedsaanwijzingen => gebiedsaanwijzingen.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const gebiedsaanwijzingenReducer = createReducer(
  initialState,
  on(GebiedsaanwijzingenActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(GebiedsaanwijzingenActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(GebiedsaanwijzingenActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return gebiedsaanwijzingenReducer(state, action);
}
