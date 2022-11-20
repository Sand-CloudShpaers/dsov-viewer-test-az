import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as OmgevingsnormenActions from './omgevingsnormen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { OmgevingsnormenEntity } from '~viewer/annotaties/types/entity';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const omgevingsnormenRootKey = 'omgevingsnormen';

export type State = EntityState<EntityPayload<OmgevingsnormenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<OmgevingsnormenEntity>>({
  selectId: omgevingsnormen => omgevingsnormen.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const omgevingsnormenReducer = createReducer(
  initialState,
  on(OmgevingsnormenActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(OmgevingsnormenActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(OmgevingsnormenActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return omgevingsnormenReducer(state, action);
}
