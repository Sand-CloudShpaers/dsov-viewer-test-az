import { getStatus, initialState, reducer as documentLocatieReducer } from './document-locatie.reducer';
import * as DocumentLocatieActions from './document-locatie.actions';
import { mockLocatieMetBoundingBox } from './document-locatie.effects.spec';
import { LoadingState } from '~model/loading-state.enum';

const id = '/akn/nl/act/1032';

describe('documentLocatieReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = documentLocatieReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should upsert document-locatie with status PENDING', () => {
    const action = DocumentLocatieActions.loading({
      documentId: id,
      href: 'href',
    });
    actual = documentLocatieReducer(initialState, action);

    expect(actual.entities[id].status).toEqual('PENDING');
    expect(getStatus(actual)).toEqual('PENDING');
  });

  it('should upsert document-locatie with status RESOLVED and data', () => {
    const action = DocumentLocatieActions.loadingSuccess({
      documentId: id,
      locatie: mockLocatieMetBoundingBox,
    });
    actual = documentLocatieReducer(initialState, action);

    expect(actual.entities[id]).toEqual({
      entityId: id,
      data: mockLocatieMetBoundingBox,
      status: LoadingState.RESOLVED,
    });
  });

  it('should upsert document-locatie with error', () => {
    const action = DocumentLocatieActions.loadingFailure({
      documentId: id,
      error: null,
    });
    actual = documentLocatieReducer(initialState, action);

    expect(actual.entities[id]).toEqual({
      entityId: id,
      status: LoadingState.REJECTED,
      error: null,
    });
  });
});
