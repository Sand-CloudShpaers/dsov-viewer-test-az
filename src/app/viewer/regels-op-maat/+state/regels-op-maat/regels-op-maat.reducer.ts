import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import * as RegelsOpMaatActions from './regels-op-maat.actions';

export const regelsOpMaatFeatureKey = 'status';
export interface State {
  loadingState: LoadingState;
}

export const initialState: State = {
  loadingState: LoadingState.RESOLVED,
};

const regelsOpMaatReducer = createReducer(
  initialState,

  on(RegelsOpMaatActions.loadRegelsOpMaat, () => ({ loadingState: LoadingState.PENDING })),
  on(RegelsOpMaatActions.loadRegelsOpMaatWithDocuments, () => ({ loadingState: LoadingState.RESOLVED })),
  on(RegelsOpMaatActions.loadRegelsOpMaatFailure, () => ({ loadingState: LoadingState.REJECTED })),
  on(RegelsOpMaatActions.resetRegelsOpMaat, () => ({ loadingState: LoadingState.RESOLVED }))
);

export function reducer(state: State | undefined, action: Action): State {
  return regelsOpMaatReducer(state, action);
}
