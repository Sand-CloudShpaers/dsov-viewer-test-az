import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as KaartenActions from './kaarten.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { KaartenEntity } from '~viewer/annotaties/types/entity';
import { LoadingState } from '~model/loading-state.enum';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const kaartenRootKey = 'kaarten';

export type State = EntityState<EntityPayload<KaartenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<KaartenEntity>>({
  selectId: kaarten => kaarten.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({ error: null });

const kaartenReducer = createReducer(
  initialState,
  on(KaartenActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(KaartenActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(KaartenActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return kaartenReducer(state, action);
}
