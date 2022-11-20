import { initialState, reducer } from './map-details.reducer';
import * as MapDetailsActions from './map-details.actions';
import { cartografieSummaryCollectieMock, featuresMock } from './map-details.mock';
import { LoadingState } from '~model/loading-state.enum';

describe('mapDetailsReducer', () => {
  let actual;
  it('should have initial state', () => {
    const action = {};
    actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should load and add features', () => {
    const action = MapDetailsActions.load({
      documentId: 'documentId',
      features: featuresMock,
    });
    actual = reducer(initialState, action);

    expect(actual.features).toEqual(featuresMock);
    expect(actual.status).toEqual(LoadingState.PENDING);
  });

  it('should load success and add cartografie', () => {
    const action = MapDetailsActions.loadSuccess({
      documentId: 'documentId',
      cartografie: cartografieSummaryCollectieMock,
    });
    actual = reducer(initialState, action);

    expect(actual.cartografie).toEqual(cartografieSummaryCollectieMock);
    expect(actual.status).toEqual(LoadingState.RESOLVED);
  });

  it('should load failure and add error', () => {
    const error = new Error('error');
    const action = MapDetailsActions.loadFailure({
      documentId: 'documentId',
      error,
    });
    actual = reducer(initialState, action);

    expect(actual.error).toEqual(error);
    expect(actual.status).toEqual(LoadingState.REJECTED);
  });

  it('should reset to initialState', () => {
    const action = MapDetailsActions.reset();
    actual = reducer(initialState, action);

    expect(actual.cartografie).toEqual(null);
    expect(actual.features).toEqual([]);
    expect(actual.status).toEqual(LoadingState.IDLE);
  });
});
