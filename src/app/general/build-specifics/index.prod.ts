import { Action, ActionReducer } from '@ngrx/store';
import { State } from '~store/state';

// deze funtie wordt in production-mode gebruikt (via fileReplacement in angular.json).
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: Action): State => reducer(state, action);
}
