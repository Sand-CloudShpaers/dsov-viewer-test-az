import { getStatus, initialState, reducer as omgevingswaardenReducer } from './omgevingswaarden.reducer';
import * as OmgevingswaardenActions from './omgevingswaarden.actions';
import { mockOmgevingswaardenResponse } from './omgevingswaarden.mock';
import { LoadingState } from '~model/loading-state.enum';

describe('Omgevingswaarden Reducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = omgevingswaardenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to PENDING on loadOmgevingswaarden', () => {
    const action = OmgevingswaardenActions.loadOmgevingswaarden({ omgevingswaarden: [] });
    const actual = omgevingswaardenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['omgevingswaarden']: {
        entityId: 'omgevingswaarden',
        status: LoadingState.PENDING,
      },
    });
  });

  it('should add results on loadOmgevingswaardenSuccess', () => {
    const action = OmgevingswaardenActions.loadOmgevingswaardenSuccess({
      omgevingswaarden: mockOmgevingswaardenResponse._embedded.omgevingswaarden,
    });
    const actual = omgevingswaardenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['omgevingswaarden']: {
        entityId: 'omgevingswaarden',
        data: mockOmgevingswaardenResponse._embedded.omgevingswaarden,
        status: LoadingState.RESOLVED,
      },
    });
  });

  it('should set status to REJECTED on loadGebiedsaanwijzingenFailure', () => {
    const error = new Error('stuk');
    const action = OmgevingswaardenActions.loadOmgevingswaardenFailure({ error });
    const actual = omgevingswaardenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['omgevingswaarden']: {
        entityId: 'omgevingswaarden',
        status: LoadingState.REJECTED,
        error,
      },
    });

    expect(getStatus(actual)).toEqual('REJECTED');
  });
});
