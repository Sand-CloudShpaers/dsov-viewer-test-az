import { Action, createReducer, on } from '@ngrx/store';
import * as StructuurelementFilterActions from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.actions';
import { StructuurElementFilter } from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.model';
import { LoadingState } from '~model/loading-state.enum';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EntityPayload } from '~general/utils/state/entity-action';

export const documentStructuurelementFilterFeatureKey = 'document-structuurelement-filter';

export type State = EntityState<EntityPayload<StructuurElementFilter>>;

export const adapter = createEntityAdapter<EntityPayload<StructuurElementFilter>>({
  selectId: entity => entity.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({});

const structuurelementFilterReducer = createReducer(
  initialState,
  on(
    StructuurelementFilterActions.loadFilter,
    (state, { id, beschrijving, filterType, themaId, hoofdlijnId, document }) =>
      adapter.upsertOne(
        {
          status: LoadingState.PENDING,
          entityId: id,
          data: {
            id,
            document,
            beschrijving,
            filterType,
            hoofdlijnId,
            themaId,
          },
        },
        state
      )
  ),

  on(StructuurelementFilterActions.loadFilterSuccess, (state, { id, divisieannotaties, regelteksten }) =>
    adapter.updateOne(
      {
        id,
        changes: {
          data: {
            ...state.entities[id].data,
            divisieannotaties,
            regelteksten,
          },
          status: LoadingState.RESOLVED,
        },
      },
      state
    )
  ),

  on(StructuurelementFilterActions.loadFilterFailure, (state, { id, error }) =>
    adapter.updateOne(
      {
        id,
        changes: {
          status: LoadingState.REJECTED,
          error,
        },
      },
      state
    )
  ),

  on(StructuurelementFilterActions.removeFilter, (state, { id }) => adapter.removeOne(id, state)),

  on(StructuurelementFilterActions.removeFilters, state => adapter.removeAll(state))
);

export function reducer(state: State | undefined, action: Action): State {
  return structuurelementFilterReducer(state, action);
}
