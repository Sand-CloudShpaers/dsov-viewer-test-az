import { Action, createReducer, on } from '@ngrx/store';
import * as OzonLocatiesActions from './ozon-locaties.actions';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { LoadingState } from '~model/loading-state.enum';

export const ozonLocatiesRootKey = 'ozonLocaties';

export type State = {
  locatieIds: string[];
  ontwerpLocatieTechnischIds: string[];
  omgevingsplanPons: boolean;
  status: LoadingState;
  error?: Error;
};

export const initialState: State = {
  locatieIds: [],
  ontwerpLocatieTechnischIds: [],
  omgevingsplanPons: false,
  status: LoadingState.IDLE,
  error: null,
};

const ozonLocatiesReducer = createReducer(
  initialState,
  on(OzonLocatiesActions.loading, () => ({
    ...initialState,
    status: LoadingState.PENDING,
  })),
  on(OzonLocatiesActions.loadSuccess, (state, { locatieIds, ontwerpLocatieTechnischIds, omgevingsplanPons }) => ({
    ...state,
    locatieIds,
    ontwerpLocatieTechnischIds,
    omgevingsplanPons,
    status: LoadingState.RESOLVED,
  })),
  on(OzonLocatiesActions.loadError, FilterActions.LoadLocatieFilterError, (state, { error }) => ({
    ...state,
    error,
    status: LoadingState.REJECTED,
  })),
  on(OzonLocatiesActions.reset, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return ozonLocatiesReducer(state, action);
}
