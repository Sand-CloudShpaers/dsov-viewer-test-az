import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import { Info as OzonInfo } from '~ozon-model/info';
import { Info as IhrInfo } from '~ihr-model/info';
import * as ApplicationInfoActions from './application-info.actions';

export const featureKey = 'application-info';

export interface State {
  ozonPresenteren: OzonInfo;
  ozonVerbeelden: OzonInfo;
  ihr: IhrInfo;
  status: LoadingState;
  error: Error;
}

export const initialState: State = {
  ozonPresenteren: null,
  ozonVerbeelden: null,
  ihr: null,
  status: LoadingState.IDLE,
  error: null,
};

const applicationInfoReducer = createReducer(
  initialState,
  on(ApplicationInfoActions.loading, state => ({
    ...state,
    status: LoadingState.PENDING,
  })),
  on(ApplicationInfoActions.loadSuccess, (state, { ozonPresenteren, ozonVerbeelden, ihr }) => ({
    ...state,
    ozonPresenteren,
    ozonVerbeelden,
    ihr,
    status: LoadingState.RESOLVED,
  })),
  on(ApplicationInfoActions.loadFailure, (state, { error }) => ({
    ...state,
    error,
    status: LoadingState.REJECTED,
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return applicationInfoReducer(state, action);
}
