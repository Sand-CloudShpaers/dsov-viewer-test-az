import { getStatus, initialState, reducer as gebiedsaanwijzingenReducer } from './gebiedsaanwijzingen.reducer';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen.actions';
import { mockGebiedsaanwijzingenResponse } from './gebiedsaanwijzingen.mock';
import { LoadingState } from '~model/loading-state.enum';

describe('Gebiedsaanwijzingen Reducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = gebiedsaanwijzingenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to PENDING on loadGebiedsaanwijzingen', () => {
    const action = GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({ gebiedsaanwijzingen: {} });
    const actual = gebiedsaanwijzingenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['gebiedsaanwijzingen']: {
        entityId: 'gebiedsaanwijzingen',
        status: LoadingState.PENDING,
      },
    });
  });

  it('should add results on loadGebiedsaanwijzingenSuccess', () => {
    const action = GebiedsaanwijzingenActions.loadGebiedsaanwijzingenSuccess({
      gebiedsaanwijzingen: mockGebiedsaanwijzingenResponse._embedded,
    });
    const actual = gebiedsaanwijzingenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['gebiedsaanwijzingen']: {
        entityId: 'gebiedsaanwijzingen',
        data: mockGebiedsaanwijzingenResponse._embedded,
        status: LoadingState.RESOLVED,
      },
    });
  });

  it('should set status to REJECTED on loadGebiedsaanwijzingenFailure', () => {
    const error = new Error('stuk');
    const action = GebiedsaanwijzingenActions.loadGebiedsaanwijzingenFailure({ error });
    const actual = gebiedsaanwijzingenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['gebiedsaanwijzingen']: {
        entityId: 'gebiedsaanwijzingen',
        status: LoadingState.REJECTED,
        error,
      },
    });

    expect(getStatus(actual)).toEqual('REJECTED');
  });
});
