import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as OmgevingswaardenActions from './omgevingswaarden.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { OmgevingswaardenEntity } from '~viewer/annotaties/types/entity';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const omgevingswaardenRootKey = 'omgevingswaarden';

export type State = EntityState<EntityPayload<OmgevingswaardenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<OmgevingswaardenEntity>>({
  selectId: omgevingswaarden => omgevingswaarden.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const omgevingswaardenReducer = createReducer(
  initialState,
  on(OmgevingswaardenActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(OmgevingswaardenActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(OmgevingswaardenActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return omgevingswaardenReducer(state, action);
}
