import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import * as ActiviteitenActions from './activiteiten.actions';
import * as OzonLocatiesActions from '~store/common/ozon-locaties/+state/ozon-locaties.actions';
import { Activiteit } from '~ozon-model/activiteit';

export type State = {
  data: Activiteit[];
  status: LoadingState;
  error?: Error;
};

export const initialState: State = {
  data: null,
  status: LoadingState.RESOLVED,
};

const activiteitenReducer = createReducer(
  initialState,
  on(ActiviteitenActions.loadingActiviteiten, (state, { activiteiten }) => ({
    ...state,
    data: activiteiten,
    status: LoadingState.PENDING,
  })),
  on(ActiviteitenActions.loadActiviteitenSuccess, (state, { activiteiten }) => ({
    ...state,
    data: activiteiten,
    status: LoadingState.RESOLVED,
  })),
  on(ActiviteitenActions.loadActiviteitenFailure, (state, { error }) => ({
    ...state,
    status: LoadingState.REJECTED,
    error,
  })),
  on(OzonLocatiesActions.loading, ActiviteitenActions.resetState, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return activiteitenReducer(state, action);
}
