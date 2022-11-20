import { LoadingState } from '~model/loading-state.enum';
import { mockOmgevingsnormenResponse } from './omgevingsnormen.mock';
import * as OmgevingsnormenActions from './omgevingsnormen.actions';
import { getStatus, initialState, reducer as omgevingsnormenReducer } from './omgevingsnormen.reducer';

describe('Omgevingsnormen Reducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = omgevingsnormenReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to PENDING on loadOmgevingsnormen', () => {
    const action = OmgevingsnormenActions.loadingOmgevingsnormen({ omgevingsnormen: [] });
    const actual = omgevingsnormenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['omgevingsnormen']: {
        entityId: 'omgevingsnormen',
        status: LoadingState.PENDING,
      },
    });
  });

  it('should add results on loadOmgevingsnormenSuccess', () => {
    const action = OmgevingsnormenActions.loadOmgevingsnormenSuccess({
      omgevingsnormen: mockOmgevingsnormenResponse._embedded.omgevingsnormen,
    });
    const actual = omgevingsnormenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['omgevingsnormen']: {
        entityId: 'omgevingsnormen',
        data: mockOmgevingsnormenResponse._embedded.omgevingsnormen,
        status: LoadingState.RESOLVED,
      },
    });
  });

  it('should set status to REJECTED on loadOmgevingsnormenFailure', () => {
    const error = new Error('stuk');
    const action = OmgevingsnormenActions.loadOmgevingsnormenFailure({ error });
    const actual = omgevingsnormenReducer(initialState, action);

    expect(actual.entities).toEqual({
      ['omgevingsnormen']: {
        entityId: 'omgevingsnormen',
        status: LoadingState.REJECTED,
        error,
      },
    });

    expect(getStatus(actual)).toEqual('REJECTED');
  });
});
