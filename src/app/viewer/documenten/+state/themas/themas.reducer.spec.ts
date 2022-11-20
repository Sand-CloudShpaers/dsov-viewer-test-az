import { initialState, reducer as themasReducer, State } from './themas.reducer';
import * as themasActions from '~viewer/documenten/+state/themas/themas.actions';
import { themasMock } from '~viewer/documenten/+state/themas/themas.selectors.spec';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

describe('themasReducer', () => {
  const document: DocumentDto = {
    documentId: 'testDocumentId',
    documentType: '',
  };
  it('should have initial state', () => {
    const action = {};
    const actual = themasReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set loadingstate on loading', () => {
    const action = themasActions.loading({
      document,
    });
    const actual = themasReducer(initialState, action);

    expect(actual).toEqual({
      ids: ['testDocumentId'],
      entities: {
        testDocumentId: {
          status: 'PENDING',
          entityId: 'testDocumentId',
        },
      },
      error: null,
    } as State);
  });

  it('should set loadingstate and themas on loadSuccess', () => {
    const action = themasActions.loadSuccess({
      document,
      themas: themasMock,
    });
    const actual = themasReducer(initialState, action);

    expect(actual).toEqual({
      ids: ['testDocumentId'],
      entities: {
        testDocumentId: {
          status: 'RESOLVED',
          entityId: 'testDocumentId',
          data: themasMock,
        },
      },
      error: null,
    } as State);
  });

  it('should set loadingstate on loadFailure', () => {
    const action = themasActions.loadFailure({
      document,
    });
    const actual = themasReducer(initialState, action);

    expect(actual).toEqual({
      ids: ['testDocumentId'],
      entities: {
        testDocumentId: {
          status: 'REJECTED',
          entityId: 'testDocumentId',
          error: undefined,
        },
      },
      error: null,
    } as State);
  });
});
