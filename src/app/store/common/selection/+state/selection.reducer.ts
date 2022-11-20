import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as SelectionActions from './selection.actions';
import { Selection } from '../selection.model';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { joinNonFalsyStrings } from '~general/utils/string.utils';

export const selectionFeatureKey = 'selection';

export type State = EntityState<EntityPayload<Selection>>;

export const adapter = createEntityAdapter<EntityPayload<Selection>>({
  selectId: selection => selection.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const selectionReducer = createReducer(
  initialState,
  on(SelectionActions.updateSelections, SelectionActions.addSelections, (state, { selections }) =>
    adapter.upsertMany(
      selections.map(selection => ({
        status: LoadingState.RESOLVED,
        entityId: getEntityId({ id: selection.id, parentId: selection.parentId }),
        data: selection,
      })),
      state
    )
  ),

  on(SelectionActions.removeSelections, (state, { selections }) =>
    adapter.removeMany(
      selections.map(selection => getEntityId(selection)),
      state
    )
  ),

  on(SelectionActions.resetSelections, (state, { excludeDocuments }) => {
    const ids = Object.values(state.entities)
      .filter(x => (excludeDocuments ? !x.data.documentDto : true))
      .map(x => x.entityId);
    return adapter.removeMany(ids, state);
  })
);
export function reducer(state: State | undefined, action: Action): State {
  return selectionReducer(state, action);
}

const getEntityId = (selection: { id: string; parentId?: string }): string =>
  joinNonFalsyStrings([selection.parentId, selection.id]);
