import { getStatus, initialState, reducer as hoofdlijnReducer } from './hoofdlijnen.reducer';
import * as HoofdlijnenActions from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.actions';
import { LoadingState } from '~model/loading-state.enum';
import { mockHoofdlijnenResponse } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.mock';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';

describe('Hoofdlijnen Reducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = hoofdlijnReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to PENDING on loading', () => {
    const action = HoofdlijnenActions.loadingHoofdlijnen({
      document: documentDtoMock,
    });
    const actual = hoofdlijnReducer(initialState, action);

    expect(actual.entities).toEqual({
      [documentDtoMock.documentId]: {
        entityId: documentDtoMock.documentId,
        status: LoadingState.PENDING,
      },
    });
  });

  it('should add results on loadHoofdlijnenSuccess', () => {
    const action = HoofdlijnenActions.loadHoofdlijnenSuccess({
      documentId: 'testDocumentId',
      vastgesteld: mockHoofdlijnenResponse,
    });
    const actual = hoofdlijnReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['testDocumentId']: {
        entityId: 'testDocumentId',
        data: {
          vastgesteld: mockHoofdlijnenResponse,
          ontwerp: undefined,
          documentId: 'testDocumentId',
        },
        status: LoadingState.RESOLVED,
      },
    });
  });

  it('should set status to REJECTED on loadHoofdlijnenFailure', () => {
    const error = new Error('stuk');
    const action = HoofdlijnenActions.loadHoofdlijnenFailure({
      documentId: 'testDocumentId',
      error,
    });
    const actual = hoofdlijnReducer(initialState, action);

    expect(actual.entities).toEqual({
      testDocumentId: {
        status: LoadingState.REJECTED,
        entityId: 'testDocumentId',
        error,
      },
    });

    expect(getStatus(actual)).toEqual('REJECTED');
  });
});
