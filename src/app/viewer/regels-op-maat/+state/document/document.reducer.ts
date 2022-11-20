import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LoadingState } from '~model/loading-state.enum';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';
import * as DocumentActions from './document.actions';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';

export const documentFeatureKey = 'document';

export type State = EntityState<EntityPayload<RegelsOpMaatDocument>>;

export const adapter = createEntityAdapter<EntityPayload<RegelsOpMaatDocument>>({
  selectId: document => document.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  error: null,
});

const regelsOpMaatDocumentReducer = createReducer(
  initialState,

  on(DocumentActions.loadRegelsOpMaatPerDocument, (state, { document }) =>
    adapter.upsertOne(
      {
        status: LoadingState.PENDING,
        entityId: document.documentId,
        data: {
          documentId: document.documentId,
          documentType: document.documentType,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: null,
          },
        },
      },
      state
    )
  ),

  on(
    DocumentActions.loadRegelsOpMaatPerDocumentSuccess,
    (
      state,
      {
        document,
        apiSource,
        regelteksten,
        ontwerpRegelteksten,
        divisieannotaties,
        ontwerpDivisieannotaties,
        teksten,
        loadMoreLinks,
      }
    ) => {
      const changes = {
        ...state.entities[document.documentId],
        status: LoadingState.RESOLVED,
        data: {
          ...state.entities[document.documentId].data,
          apiSource,
          regelteksten,
          ontwerpRegelteksten,
          divisieannotaties,
          ontwerpDivisieannotaties,
          teksten,
          loadMoreLinks,
          statusLoadMore: LoadingState.RESOLVED,
        },
      };
      return adapter.updateOne({ id: document.documentId, changes }, state);
    }
  ),

  on(DocumentActions.loadRegelsOpMaatPerDocumentFailure, (state, { document, error }) => {
    const changes = {
      ...state.entities[document.documentId],
      status: LoadingState.REJECTED,
      error,
    };
    return adapter.updateOne({ id: document.documentId, changes }, state);
  }),

  /* LOAD MORE */

  on(DocumentActions.loadMoreRegelsOpMaatPerDocument, (state, { document }) => {
    const changes = {
      ...state.entities[document.documentId],
      data: {
        ...state.entities[document.documentId].data,
        statusLoadMore: LoadingState.PENDING,
      },
    };
    return adapter.updateOne({ id: document.documentId, changes }, state);
  }),

  on(
    DocumentActions.loadMoreRegelsOpMaatPerDocumentSuccess,
    (
      state,
      {
        document,
        regelteksten,
        ontwerpRegelteksten,
        divisieannotaties,
        ontwerpDivisieannotaties,
        teksten,
        loadMoreLinks,
      }
    ) => {
      const data = state.entities[document.documentId].data;
      const changes = {
        ...state.entities[document.documentId],
        data: {
          ...data,
          regelteksten: data.regelteksten.concat(regelteksten),
          ontwerpRegelteksten: data.ontwerpRegelteksten.concat(ontwerpRegelteksten),
          divisieannotaties: data.divisieannotaties.concat(divisieannotaties),
          ontwerpDivisieannotaties: data.ontwerpDivisieannotaties.concat(ontwerpDivisieannotaties),
          teksten: data.teksten.concat(teksten),
          loadMoreLinks,
          statusLoadMore: LoadingState.RESOLVED,
        },
      };
      return adapter.updateOne({ id: document.documentId, changes: changes }, state);
    }
  ),

  on(DocumentActions.loadMoreRegelsOpMaatPerDocumentFailure, (state, { document, error }) => {
    const changes = {
      ...state.entities[document.documentId],
      data: {
        ...state.entities[document.documentId].data,
        statusLoadMore: LoadingState.REJECTED,
      },
      error,
    };
    return adapter.updateOne({ id: document.documentId, changes: changes }, state);
  }),

  on(RegelsOpMaatActions.resetRegelsOpMaat, state => adapter.removeAll(state))
);

export function reducer(state: State | undefined, action: Action): State {
  return regelsOpMaatDocumentReducer(state, action);
}
