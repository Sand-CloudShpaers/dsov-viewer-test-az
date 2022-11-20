import * as ApplicationInfoActions from './application-info.actions';
import { LoadingState } from '~model/loading-state.enum';
import { initialState, reducer, State } from './application-info.reducer';

export const resolvedState = {
  ...initialState,
  ozonPresenteren: {
    app: {
      version: '6.3.1',
      cimowVersion: '2.0.0',
      stopVersion: '1.1.0',
    },
  },
  ozonVerbeelden: {
    app: {
      version: '2.3.1',
      cimowVersion: '2.0.0',
      stopVersion: '1.1.0',
    },
  },
  ihr: {
    version: '4.0.0',
  },
  status: LoadingState.RESOLVED,
};

describe('applicationInfoReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should have PENDING state', () => {
    const action = ApplicationInfoActions.loading();
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual({ ...initialState, status: LoadingState.PENDING });
  });

  it('should have filled state when success', () => {
    const action = ApplicationInfoActions.loadSuccess({
      ozonVerbeelden: {
        app: {
          version: '2.3.1',
          cimowVersion: '2.0.0',
          stopVersion: '1.1.0',
        },
      },
      ozonPresenteren: {
        app: {
          version: '6.3.1',
          cimowVersion: '2.0.0',
          stopVersion: '1.1.0',
        },
      },
      ihr: {
        version: '4.0.0',
      },
    });
    const actual = reducer(initialState, action);

    expect(actual).toEqual(resolvedState as State);
  });

  it('should have REJECTED state', () => {
    const action = ApplicationInfoActions.loadFailure({ error: { message: '', name: 'name' } });
    const actual = reducer(undefined, action as any);

    expect(actual).toEqual({ ...initialState, status: LoadingState.REJECTED, error: { message: '', name: 'name' } });
  });
});
