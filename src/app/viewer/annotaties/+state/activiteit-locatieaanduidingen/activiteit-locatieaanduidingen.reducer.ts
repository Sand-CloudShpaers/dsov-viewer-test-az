import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as ActiviteitLocatieaanduidingenActions from './activiteit-locatieaanduidingen.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { ActiviteitLocatieaanduidingenEntity } from '~viewer/annotaties/types/entity';
import * as AnnotatiesActions from '../annotaties.actions';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const activiteitLocatieaanduidingenRootKey = 'activiteitLocatieaanduidingen';

export type State = EntityState<EntityPayload<ActiviteitLocatieaanduidingenEntity>>;

export const adapter = createEntityAdapter<EntityPayload<ActiviteitLocatieaanduidingenEntity>>({
  selectId: activiteiten => activiteiten.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const activiteitLocatieaanduidingenReducer = createReducer(
  initialState,
  on(ActiviteitLocatieaanduidingenActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(ActiviteitLocatieaanduidingenActions.loadSuccess, (state, entity) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(entity.annotationId), data: entity, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(ActiviteitLocatieaanduidingenActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return activiteitLocatieaanduidingenReducer(state, action);
}
