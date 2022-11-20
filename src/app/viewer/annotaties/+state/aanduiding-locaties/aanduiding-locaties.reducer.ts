import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EntityPayload } from '~general/utils/state/entity-action';
import { Action, createReducer, on } from '@ngrx/store';
import * as AanduidingLocatiesActions from './aanduiding-locaties.actions';
import { LoadingState } from '~model/loading-state.enum';
import { Locatie } from '~ozon-model/locatie';
import * as AnnotatiesActions from '../annotaties.actions';
import { OntwerpLocatie } from '~ozon-model/ontwerpLocatie';

export const aanduidingLocatiesRootKey = 'aanduidingLocaties';

export type State = EntityState<EntityPayload<{ id: string; locaties: (Locatie | OntwerpLocatie)[] }>>;

export const adapter = createEntityAdapter<EntityPayload<{ id: string; locaties: (Locatie | OntwerpLocatie)[] }>>({
  selectId: activiteitLocatieAanduidingId => activiteitLocatieAanduidingId.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const aanduidingLocatiesReducer = createReducer(
  initialState,
  on(AanduidingLocatiesActions.loading, (state, { id }) =>
    adapter.upsertOne({ entityId: id, status: LoadingState.PENDING }, state)
  ),
  on(AanduidingLocatiesActions.loadSuccess, (state, aanduidingLocaties) =>
    adapter.upsertOne(
      {
        entityId: aanduidingLocaties.id,
        data: { id: aanduidingLocaties.id, locaties: aanduidingLocaties.locaties },
        status: LoadingState.RESOLVED,
      },
      state
    )
  ),
  on(AanduidingLocatiesActions.loadError, (state, { id }) =>
    adapter.upsertOne({ entityId: id, status: LoadingState.REJECTED }, state)
  ),
  on(AnnotatiesActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return aanduidingLocatiesReducer(state, action);
}
