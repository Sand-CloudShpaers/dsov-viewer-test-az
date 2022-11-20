import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '~store/state';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen/gebiedsaanwijzingen.reducer';
import * as fromOmgevingsnormen from './omgevingsnormen/omgevingsnormen.reducer';
import * as fromOmgevingswaarden from './omgevingswaarden/omgevingswaarden.reducer';

export const gebiedsinfoFeatureRootKey = 'gebieden';

interface GebiedsInfoState {
  readonly [fromGebiedsaanwijzingen.gebiedsaanwijzingenFeatureKey]: fromGebiedsaanwijzingen.State;
  readonly [fromOmgevingsnormen.omgevingsnormenFeatureKey]: fromOmgevingsnormen.State;
  readonly [fromOmgevingswaarden.omgevingswaardenFeatureKey]: fromOmgevingswaarden.State;
}

export interface State extends fromRoot.State {
  readonly [gebiedsinfoFeatureRootKey]: GebiedsInfoState;
}

export function reducers(state: GebiedsInfoState | undefined, action: Action): GebiedsInfoState {
  return combineReducers({
    [fromGebiedsaanwijzingen.gebiedsaanwijzingenFeatureKey]: fromGebiedsaanwijzingen.reducer,
    [fromOmgevingsnormen.omgevingsnormenFeatureKey]: fromOmgevingsnormen.reducer,
    [fromOmgevingswaarden.omgevingswaardenFeatureKey]: fromOmgevingswaarden.reducer,
  })(state, action);
}

export const selectGebiedsInfoState = createFeatureSelector<GebiedsInfoState>(gebiedsinfoFeatureRootKey);

export const gebiedsInfoInitialState = {
  [gebiedsinfoFeatureRootKey]: {
    [fromGebiedsaanwijzingen.gebiedsaanwijzingenFeatureKey]: fromGebiedsaanwijzingen.initialState,
    [fromOmgevingsnormen.omgevingsnormenFeatureKey]: fromOmgevingsnormen.initialState,
    [fromOmgevingswaarden.omgevingswaardenFeatureKey]: fromOmgevingswaarden.initialState,
  },
};
