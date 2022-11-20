import * as fromDocument from './document/document.reducer';
import * as fromRegelsOpMaat from './regels-op-maat/regels-op-maat.reducer';
import * as fromRoot from '~store/state';
import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';

export const regelsOpMaatRootKey = 'regelsOpMaat';

export interface RegelsOpMaatState {
  readonly [fromDocument.documentFeatureKey]: fromDocument.State;
  readonly [fromRegelsOpMaat.regelsOpMaatFeatureKey]: fromRegelsOpMaat.State;
}

export interface State extends fromRoot.State {
  readonly [regelsOpMaatRootKey]: RegelsOpMaatState;
}

export function reducers(state: RegelsOpMaatState | undefined, action: Action): RegelsOpMaatState {
  return combineReducers({
    [fromDocument.documentFeatureKey]: fromDocument.reducer,
    [fromRegelsOpMaat.regelsOpMaatFeatureKey]: fromRegelsOpMaat.reducer,
  })(state, action);
}

export const selectRegelsOpMaatState = createFeatureSelector<RegelsOpMaatState>(regelsOpMaatRootKey);
