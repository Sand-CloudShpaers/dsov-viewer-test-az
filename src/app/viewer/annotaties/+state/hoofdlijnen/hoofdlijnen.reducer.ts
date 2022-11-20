import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as HoofdlijnenActions from './hoofdlijnen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { HoofdlijnenEntity } from '~viewer/annotaties/types/entity';
import { LoadingState } from '~model/loading-state.enum';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const hoofdlijnenRootKey = 'hoofdlijnen';

export type State = EntityState<EntityPayload<HoofdlijnenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<HoofdlijnenEntity>>({
  selectId: hoofdlijnen => hoofdlijnen.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({ error: null });

const hoofdlijnenReducer = createReducer(
  initialState,
  on(HoofdlijnenActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(HoofdlijnenActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(HoofdlijnenActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return hoofdlijnenReducer(state, action);
}
