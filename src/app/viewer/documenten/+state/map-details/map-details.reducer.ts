import { Action, createReducer, on } from '@ngrx/store';
import { FeatureLike } from 'ol/Feature';
import { CartografieSummaryCollectie } from '~ihr-model/cartografieSummaryCollectie';
import { LoadingState } from '~model/loading-state.enum';
import * as MapDetailsActions from './map-details.actions';

export const featureKey = 'map-details';

export interface State {
  cartografie: CartografieSummaryCollectie;
  features: FeatureLike[];
  status: LoadingState;
  error?: Error;
}

export const initialState: State = {
  cartografie: null,
  features: [],
  status: LoadingState.IDLE,
};

const mapDetailsReducer = createReducer(
  initialState,
  on(MapDetailsActions.load, (state, { features }) => ({
    ...state,
    features,
    status: LoadingState.PENDING,
  })),
  on(MapDetailsActions.loadSuccess, (state, { cartografie }) => ({
    ...state,
    cartografie,
    status: LoadingState.RESOLVED,
  })),
  on(MapDetailsActions.loadFailure, (state, { error }) => ({
    ...state,
    status: LoadingState.REJECTED,
    error,
  })),
  on(MapDetailsActions.reset, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return mapDetailsReducer(state, action);
}
