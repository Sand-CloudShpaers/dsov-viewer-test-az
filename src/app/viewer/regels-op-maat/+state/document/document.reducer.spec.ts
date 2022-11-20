import { initialState, reducer as regelsOpMaatDocumentenReducer, State } from './document.reducer';
import * as DocumentenActions from './document.actions';
import { LoadingState } from '~model/loading-state.enum';
import { ApiSource } from '~model/internal/api-source';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

const document: DocumentDto = {
  documentId: 'documentId',
  documentType: 'regeling',
};

const pendingState: State = {
  ids: [document.documentId],
  entities: {
    [document.documentId]: {
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
  },
  error: null,
} as State;

const resolvedState: State = {
  ids: [document.documentId],
  entities: {
    [document.documentId]: {
      status: LoadingState.RESOLVED,
      data: {
        documentId: document.documentId,
        documentType: document.documentType,
        apiSource: ApiSource.OZON,
        regelteksten: [],
        ontwerpRegelteksten: [],
        divisieannotaties: [],
        ontwerpDivisieannotaties: [],
        teksten: [],
        loadMoreLinks: {
          vastgesteld: {
            regelteksten: {
              href: undefined,
              zoekParameters: [],
            },
          },
        },
        statusLoadMore: LoadingState.RESOLVED,
      },
      entityId: document.documentId,
    },
  },
  error: null,
} as State;

const rejectedState: State = {
  ids: [document.documentId],
  entities: {
    [document.documentId]: {
      status: LoadingState.REJECTED,
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
      error: { name: '', message: '' },
    },
  },
  error: null,
} as State;

describe('regelsOpMaatDocumentenReducer', () => {
  describe('load document', () => {
    it('should have initial state', () => {
      const action = {};
      const actual = regelsOpMaatDocumentenReducer(undefined, action as any);

      expect(actual).toEqual(initialState);
    });

    it('should set pending state', () => {
      const action = DocumentenActions.loadRegelsOpMaatPerDocument({
        document,
      });
      const actual = regelsOpMaatDocumentenReducer(initialState, action);

      expect(actual).toEqual(pendingState);
    });

    it('should set resolved state', () => {
      const action = DocumentenActions.loadRegelsOpMaatPerDocumentSuccess({
        document,
        apiSource: ApiSource.OZON,
        regelteksten: [],
        ontwerpRegelteksten: [],
        divisieannotaties: [],
        ontwerpDivisieannotaties: [],
        teksten: [],
        loadMoreLinks: {
          vastgesteld: {
            regelteksten: {
              href: undefined,
              zoekParameters: [],
            },
          },
        },
      });
      const actual = regelsOpMaatDocumentenReducer(pendingState, action);

      expect(actual).toEqual(resolvedState);
    });

    it('should set failed state', () => {
      const action = DocumentenActions.loadRegelsOpMaatPerDocumentFailure({
        document,
        error: { name: '', message: '' },
      });
      const actual = regelsOpMaatDocumentenReducer(pendingState, action);

      expect(actual).toEqual(rejectedState);
    });

    it('should reset state', () => {
      const action = RegelsOpMaatActions.resetRegelsOpMaat();
      const actual = regelsOpMaatDocumentenReducer(initialState, action);

      expect(actual).toEqual(initialState);
    });
  });

  describe('load more', () => {
    it('should set load more pending state', () => {
      const action = DocumentenActions.loadMoreRegelsOpMaatPerDocument({
        document,
      });
      const newState = {
        ...resolvedState,
        entities: {
          [document.documentId]: {
            ...resolvedState.entities[document.documentId],
            data: {
              ...resolvedState.entities[document.documentId].data,
              statusLoadMore: LoadingState.PENDING,
            },
          },
        },
      };
      const actual = regelsOpMaatDocumentenReducer(resolvedState, action);

      expect(actual).toEqual(newState);
    });

    it('should set load more resolved state', () => {
      const action = DocumentenActions.loadMoreRegelsOpMaatPerDocumentSuccess({
        document,
        apiSource: ApiSource.OZON,
        regelteksten: [],
        ontwerpRegelteksten: [],
        divisieannotaties: [],
        ontwerpDivisieannotaties: [],
        teksten: [],
        loadMoreLinks: {
          vastgesteld: {
            regelteksten: {
              href: undefined,
              zoekParameters: [],
            },
          },
        },
      });
      const newState = {
        ...resolvedState,
        entities: {
          [document.documentId]: {
            ...resolvedState.entities[document.documentId],
            data: {
              ...resolvedState.entities[document.documentId].data,
              statusLoadMore: LoadingState.RESOLVED,
            },
          },
        },
      };
      const actual = regelsOpMaatDocumentenReducer(resolvedState, action);

      expect(actual).toEqual(newState);
    });

    it('should set load more failed state', () => {
      const action = DocumentenActions.loadMoreRegelsOpMaatPerDocumentFailure({
        document,
        error: { name: '', message: '' },
      });
      const newState = {
        ...resolvedState,
        entities: {
          [document.documentId]: {
            ...resolvedState.entities[document.documentId],
            data: {
              ...resolvedState.entities[document.documentId].data,
              statusLoadMore: LoadingState.REJECTED,
            },
            error: { name: '', message: '' },
          },
        },
      };
      const actual = regelsOpMaatDocumentenReducer(resolvedState, action);

      expect(actual).toEqual(newState);
    });
  });
});
