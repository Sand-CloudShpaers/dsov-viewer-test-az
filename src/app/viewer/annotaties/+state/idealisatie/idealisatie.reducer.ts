import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as IdealisatieActions from './idealisatie.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import * as AnnotatiesActions from '../annotaties.actions';
import { Locaties } from '~ozon-model/locaties';
import { getAnnotationEntityId } from '~viewer/annotaties/helpers/annotaties';

export const featureKey = 'idealisatie';

export type State = EntityState<EntityPayload<Locaties>>;

export const adapter = createEntityAdapter<EntityPayload<Locaties>>({
  selectId: idealisatie => idealisatie.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({ error: null });

const idealisatieReducer = createReducer(
  initialState,
  on(IdealisatieActions.loading, (state, { annotationId }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), status: LoadingState.PENDING }, state)
  ),
  on(IdealisatieActions.loadSuccess, (state, { annotationId, locaties }) =>
    adapter.upsertOne(
      { entityId: getAnnotationEntityId(annotationId), data: locaties, status: LoadingState.RESOLVED },
      state
    )
  ),
  on(IdealisatieActions.loadError, (state, { annotationId, error }) =>
    adapter.upsertOne({ entityId: getAnnotationEntityId(annotationId), error, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return idealisatieReducer(state, action);
}
