import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '~store/state';
import * as fromPlannen from './plannen/plannen.reducer';
import { PlannenState } from './plannen/types/plannenState';

export const filteredResultsFeatureRootKey = 'filteredResults';

export interface FilteredResultsState {
  readonly [fromPlannen.plannenRootKey]: PlannenState;
}

export interface State extends fromRoot.State {
  readonly [filteredResultsFeatureRootKey]: FilteredResultsState;
}

export function reducers(state: FilteredResultsState | undefined, action: Action): FilteredResultsState {
  return combineReducers({
    [fromPlannen.plannenRootKey]: fromPlannen.reducer,
  })(state, action);
}

export const selectFilteredResultState = createFeatureSelector<FilteredResultsState>(filteredResultsFeatureRootKey);
