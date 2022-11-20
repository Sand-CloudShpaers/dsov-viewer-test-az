// deze file is via sonar.exclusions uitgesloten van inspectie.
// code in deze file mag alleen in dev-mode gebruikt worden.

/* eslint-disable no-console */
import { Action, ActionReducer } from '@ngrx/store';
import { State } from '~store/state';

// deze functie wordt alleen in dev-mode gebruikt.
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state: State, action: Action): State => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();
    return result;
  };
}
