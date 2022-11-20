import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import { Plan } from '~ihr-model/plan';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';
import { getCollectionStatus } from '~general/utils/state/collection-status-helpers';
import { EntityPayload } from '~general/utils/state/entity-action';
import * as DocumentenActions from './documenten.actions';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';

export const documentenFeatureKey = 'documenten';

export interface State
  extends EntityState<EntityPayload<{ ozon?: Regeling | OntwerpRegeling | Omgevingsvergunning; ihr?: Plan }>> {
  selectedDocument: DocumentDto | null;
  selectedElementId: string | null;
}

export const adapter = createEntityAdapter<
  EntityPayload<{
    ozon?: Regeling | OntwerpRegeling | Omgevingsvergunning;
    ihr?: Plan;
  }>
>({
  selectId: doc => doc.entityId,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  selectedDocument: null,
  selectedElementId: null,
});

const documentenReducer = createReducer(
  initialState,
  on(DocumentenActions.resetDocumenten, _ => initialState),

  on(
    PlannenActions.ozonLoadSuccess,
    PlannenActions.ozonLoadMoreSuccess,
    RegelsOpMaatActions.loadDocumentsSuccess,
    (state, { regelingen }) =>
      adapter.upsertMany(
        regelingen.map(document => ({
          status: LoadingState.RESOLVED,
          entityId: document.identificatie,
          data: { ozon: document },
        })),
        state
      )
  ),

  on(
    PlannenActions.ozonLoadSuccess,
    PlannenActions.ozonOmgevingsvergunningLoadMoreSuccess,
    (state, { omgevingsvergunningen }) =>
      adapter.upsertMany(
        omgevingsvergunningen.map(document => ({
          status: LoadingState.RESOLVED,
          entityId: document.identificatie,
          data: { ozon: document },
        })),
        state
      )
  ),

  on(PlannenActions.ozonOntwerpLoadSuccess, PlannenActions.ozonOntwerpLoadMoreSuccess, (state, { ontwerpRegelingen }) =>
    adapter.upsertMany(
      ontwerpRegelingen.map(document => ({
        status: LoadingState.RESOLVED,
        entityId: document.technischId,
        data: { ozon: document },
      })),
      state
    )
  ),

  on(PlannenActions.ihrLoadSuccess, PlannenActions.ihrLoadMoreSuccess, (state, { ihrPlannen }) =>
    adapter.upsertMany(
      ihrPlannen.map(document => ({
        status: LoadingState.RESOLVED,
        entityId: document.id,
        data: { ihr: document },
      })),
      state
    )
  ),
  on(DocumentenActions.loadDocumentSuccess, (state, { ozon, ihr, id }) =>
    adapter.upsertOne({ status: LoadingState.RESOLVED, entityId: id, data: { ozon, ihr } }, state)
  ),
  on(
    DocumentenActions.loadDocumentFailure,
    (state, { id, error }): State => adapter.upsertOne({ status: LoadingState.REJECTED, entityId: id, error }, state)
  ),
  on(DocumentenActions.setSelectedDocument, (state, { document }) => ({
    ...state,
    selectedDocument: document,
  })),
  on(DocumentenActions.resetSelectedDocument, state => ({
    ...state,
    selectedDocument: null,
    selectedElementId: null,
  })),
  on(DocumentenActions.setSelectedElement, (state, { id }) => ({ ...state, selectedElementId: id })),
  on(DocumentenActions.resetSelectedElement, state => ({ ...state, selectedElementId: null }))
);

export function reducer(state: State | undefined, action: Action): State {
  return documentenReducer(state, action);
}

export const selectedDocumentDto = (state: State): DocumentDto => state.selectedDocument;
export const selectedElementId = (state: State): string => state.selectedElementId;

export const getStatus = (state: State): LoadingState => getCollectionStatus(state);
