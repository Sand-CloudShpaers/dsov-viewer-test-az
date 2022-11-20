import { initialState, reducer as documentVersiesReducer } from './document-versies.reducer';
import * as DocumentVersiesActions from './document-versies.actions';

const id = '/akn/nl/act/1032';

describe('documentVersiesReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = documentVersiesReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should upsert entity, with vastgesteld, with status PENDING', () => {
    const action = DocumentVersiesActions.loadingVastgesteld({
      documentId: id,
      isOntwerp: false,
    });
    actual = documentVersiesReducer(initialState, action);

    expect(actual.vastgesteld.status).toEqual('PENDING');
  });

  it('should upsert entity, with vastgesteld, with data', () => {
    const action = DocumentVersiesActions.loadingVastgesteldSuccess({
      documentId: id,
      regelingen: [],
    });
    actual = documentVersiesReducer(initialState, action);

    expect(actual.vastgesteld.regelingen).toEqual([]);
  });

  it('should upsert entity, with ontwerp, with status PENDING', () => {
    const action = DocumentVersiesActions.loadingOntwerp({
      documentId: id,
      hrefs: [],
    });
    actual = documentVersiesReducer(initialState, action);

    expect(actual.ontwerp.status).toEqual('PENDING');
  });

  it('should upsert entity, with ontwerp, with data', () => {
    const action = DocumentVersiesActions.loadingOntwerpSuccess({
      documentId: id,
      regelingen: [],
    });
    actual = documentVersiesReducer(initialState, action);

    expect(actual.ontwerp.regelingen).toEqual([]);
  });

  it('should reset the state', () => {
    const action = DocumentVersiesActions.reset();
    actual = documentVersiesReducer(initialState, action);

    expect(actual).toEqual(initialState);
  });
});
