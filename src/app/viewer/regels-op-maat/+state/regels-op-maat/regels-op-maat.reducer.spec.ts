import { initialState, reducer as regelsOpMaatReducer, State } from './regels-op-maat.reducer';
import * as RegelsOpMaatActions from './regels-op-maat.actions';
import { LoadingState } from '~model/loading-state.enum';

describe('regelsOpMaatReducer', () => {
  it('should have initial state', () => {
    const action = {};
    const actual = regelsOpMaatReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should set status to pending', () => {
    const action = RegelsOpMaatActions.loadRegelsOpMaat();
    const actual = regelsOpMaatReducer(initialState, action);

    expect(actual).toEqual({
      loadingState: LoadingState.PENDING,
    } as State);
  });

  it('should set status to resolved', () => {
    const action = RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
      documents: [],
    });
    const actual = regelsOpMaatReducer(initialState, action);

    expect(actual).toEqual({
      loadingState: LoadingState.RESOLVED,
    } as State);
  });

  it('should set status to rejected', () => {
    const action = RegelsOpMaatActions.loadRegelsOpMaatFailure({ error: null });
    const actual = regelsOpMaatReducer(initialState, action);

    expect(actual).toEqual({
      loadingState: LoadingState.REJECTED,
    } as State);
  });

  it('should reset state', () => {
    const action = RegelsOpMaatActions.resetRegelsOpMaat();
    const actual = regelsOpMaatReducer(initialState, action);

    expect(actual).toEqual(initialState);
  });
});
