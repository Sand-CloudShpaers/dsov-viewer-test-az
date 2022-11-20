import { createIhrPlanMock, createOntwerpRegelingMock, createRegelingMock } from '~mocks/documenten.mock';
import { LoadingState } from '~model/loading-state.enum';
import { Regeling } from '~ozon-model/regeling';
import {
  loadDocumentFailure,
  loadDocumentSuccess,
  resetDocumenten,
  resetSelectedDocument,
  resetSelectedElement,
  setSelectedDocument,
  setSelectedElement,
} from './documenten.actions';

import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import { initialState, reducer as documentenReducer, State } from './documenten.reducer';
import { Plan } from '~ihr-model/plan';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

describe('documentenReducer', () => {
  const documentId = 'blaat';
  const document: Regeling = createRegelingMock({ identificatie: documentId });
  const ontwerpDocument: OntwerpRegeling = createOntwerpRegelingMock({
    identificatie: documentId,
  });
  const ihrDocument: Plan = createIhrPlanMock({ id: documentId });

  it('should have initial state', () => {
    const action = {};
    const actual = documentenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should populate entities from ihrLoadSuccess', () => {
    const action = PlannenActions.ihrLoadSuccess({ ihrPlannen: [ihrDocument] });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      entities: {
        [documentId]: {
          data: { ihr: ihrDocument },
          status: LoadingState.RESOLVED,
          entityId: documentId,
        },
      },
      ids: [documentId],
      selectedDocument: null,
      selectedElementId: null,
    } as State);
  });

  it('should populate entities from ozonLoadSuccess', () => {
    const action = PlannenActions.ozonLoadSuccess({
      regelingen: [document],
      omgevingsvergunningen: [],
    });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      entities: {
        [documentId]: {
          data: { ozon: document },
          status: LoadingState.RESOLVED,
          entityId: documentId,
        },
      },
      ids: [documentId],
      selectedDocument: null,
      selectedElementId: null,
    } as State);
  });

  it('should populate entities from ozonOntwerpLoadSuccess', () => {
    const action = PlannenActions.ozonOntwerpLoadSuccess({
      ontwerpRegelingen: [ontwerpDocument],
    });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      entities: {
        [ontwerpDocument.technischId]: {
          data: { ozon: ontwerpDocument },
          status: LoadingState.RESOLVED,
          entityId: ontwerpDocument.technischId,
        },
      },
      ids: [ontwerpDocument.technischId],
      selectedDocument: null,
      selectedElementId: null,
    } as State);
  });

  it('should populate entities from success', () => {
    const action = loadDocumentSuccess({
      ozon: document,
      id: documentId,
      setAsSelected: true,
    });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      entities: {
        [documentId]: { data: { ozon: document, ihr: undefined }, status: LoadingState.RESOLVED, entityId: documentId },
      },
      ids: [documentId],
      selectedDocument: null,
      selectedElementId: null,
    } as State);
  });

  it('should set status to error', () => {
    const action = loadDocumentFailure({ error: new Error('Internal Server Error'), id: documentId });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      entities: {
        [documentId]: {
          status: LoadingState.REJECTED,
          error: new Error('Internal Server Error'),
          entityId: documentId,
        },
      },
      ids: [documentId],
      selectedDocument: null,
      selectedElementId: null,
    } as State);
  });

  it('should select document id', () => {
    const action = setSelectedDocument({ document: documentDtoMock });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      selectedDocument: documentDtoMock,
    } as State);
  });

  it('should reset selected document id', () => {
    const action = resetSelectedDocument();
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      selectedDocument: null,
      selectedElementId: null,
    } as State);
  });

  it('should select element id', () => {
    const action = setSelectedElement({ id: 'elementId' });
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      selectedElementId: 'elementId',
    } as State);
  });

  it('should reset selected element id', () => {
    const action = resetSelectedElement();
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual({
      ...initialState,
      selectedElementId: null,
    } as State);
  });

  it('should clear state', () => {
    const action = resetDocumenten();
    const actual = documentenReducer(initialState, action);

    expect(actual).toEqual(initialState);
  });
});
