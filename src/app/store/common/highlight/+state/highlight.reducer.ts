import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as HighlightActions from './highlight.actions';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { Highlight } from '../types/highlight.model';

export const featureKey = 'highlight';

export interface State extends EntityState<EntityPayload<Highlight>> {
  /* Current id vastleggen. Er kan altijd maar één ge-highlight zijn */
  current: string | null;
}

export const adapter = createEntityAdapter<EntityPayload<Highlight>>({
  selectId: highlight => highlight.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  current: null,
  error: null,
});

const highlightReducer = createReducer(
  initialState,
  on(HighlightActions.loadingSuccess, (state, highlight) =>
    adapter.upsertOne({ status: LoadingState.RESOLVED, entityId: highlight.id, data: highlight }, state)
  ),

  on(HighlightActions.load, (state, { id }) => ({
    ...state,
    current: id,
  })),

  on(HighlightActions.cancel, state => ({
    ...state,
    current: null,
  })),

  on(HighlightActions.loading, (state, highlight) =>
    adapter.upsertOne(
      {
        status: LoadingState.PENDING,
        entityId: highlight.id,
        data: highlight,
      },
      state
    )
  ),

  on(HighlightActions.loadingFailure, (state, { id, error }) =>
    adapter.upsertOne({ status: LoadingState.REJECTED, entityId: id, error }, state)
  ),

  on(HighlightActions.reset, state => adapter.removeAll(state))
);

export const current = (state: State): string => state.current;

export function reducer(state: State | undefined, action: Action): State {
  return highlightReducer(state, action);
}
