import { Action, combineReducers, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '~store/state';
import * as fromActiviteitLocatieaanduidingen from './activiteit-locatieaanduidingen/activiteit-locatieaanduidingen.reducer';
import * as fromAanduidingLocaties from './aanduiding-locaties/aanduiding-locaties.reducer';
import * as fromLocaties from './locaties/locaties.reducer';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen/gebiedsaanwijzingen.reducer';
import * as fromOmgevingsnormen from './omgevingsnormen/omgevingsnormen.reducer';
import * as fromOmgevingswaarden from './omgevingswaarden/omgevingswaarden.reducer';
import * as fromHoofdlijnen from './hoofdlijnen/hoofdlijnen.reducer';
import * as fromKaarten from './kaarten/kaarten.reducer';
import * as fromIdealisatie from './idealisatie/idealisatie.reducer';
import * as fromBestemmingsplanFeatures from './bestemminsplan-features/bestemmingsplan-features.reducer';

export const annotatiesFeatureRootKey = 'annotaties';

interface AnnotatiesState {
  readonly [fromActiviteitLocatieaanduidingen.activiteitLocatieaanduidingenRootKey]: fromActiviteitLocatieaanduidingen.State;
  readonly [fromAanduidingLocaties.aanduidingLocatiesRootKey]: fromAanduidingLocaties.State;
  readonly [fromLocaties.locatiesRootKey]: fromLocaties.State;
  readonly [fromGebiedsaanwijzingen.gebiedsaanwijzingenRootKey]: fromGebiedsaanwijzingen.State;
  readonly [fromOmgevingsnormen.omgevingsnormenRootKey]: fromOmgevingsnormen.State;
  readonly [fromOmgevingswaarden.omgevingswaardenRootKey]: fromOmgevingswaarden.State;
  readonly [fromHoofdlijnen.hoofdlijnenRootKey]: fromHoofdlijnen.State;
  readonly [fromKaarten.kaartenRootKey]: fromKaarten.State;
  readonly [fromIdealisatie.featureKey]: fromIdealisatie.State;
  readonly [fromBestemmingsplanFeatures.bestemmingsplanFeaturesRootKey]: fromBestemmingsplanFeatures.State;
}

export interface State extends fromRoot.State {
  readonly [annotatiesFeatureRootKey]: AnnotatiesState;
}

export function reducers(state: AnnotatiesState | undefined, action: Action): AnnotatiesState {
  return combineReducers({
    [fromActiviteitLocatieaanduidingen.activiteitLocatieaanduidingenRootKey]: fromActiviteitLocatieaanduidingen.reducer,
    [fromAanduidingLocaties.aanduidingLocatiesRootKey]: fromAanduidingLocaties.reducer,
    [fromLocaties.locatiesRootKey]: fromLocaties.reducer,
    [fromGebiedsaanwijzingen.gebiedsaanwijzingenRootKey]: fromGebiedsaanwijzingen.reducer,
    [fromOmgevingsnormen.omgevingsnormenRootKey]: fromOmgevingsnormen.reducer,
    [fromOmgevingswaarden.omgevingswaardenRootKey]: fromOmgevingswaarden.reducer,
    [fromHoofdlijnen.hoofdlijnenRootKey]: fromHoofdlijnen.reducer,
    [fromKaarten.kaartenRootKey]: fromKaarten.reducer,
    [fromIdealisatie.featureKey]: fromIdealisatie.reducer,
    [fromBestemmingsplanFeatures.bestemmingsplanFeaturesRootKey]: fromBestemmingsplanFeatures.reducer,
  })(state, action);
}

export const selectAnnotatiesState = createFeatureSelector<AnnotatiesState>(annotatiesFeatureRootKey);

export const annotatiesInitialState = {
  [annotatiesFeatureRootKey]: {
    [fromActiviteitLocatieaanduidingen.activiteitLocatieaanduidingenRootKey]:
      fromActiviteitLocatieaanduidingen.initialState,
    [fromAanduidingLocaties.aanduidingLocatiesRootKey]: fromAanduidingLocaties.initialState,
    [fromLocaties.locatiesRootKey]: fromLocaties.initialState,
    [fromGebiedsaanwijzingen.gebiedsaanwijzingenRootKey]: fromGebiedsaanwijzingen.initialState,
    [fromOmgevingsnormen.omgevingsnormenRootKey]: fromOmgevingsnormen.initialState,
    [fromOmgevingswaarden.omgevingswaardenRootKey]: fromOmgevingswaarden.initialState,
    [fromHoofdlijnen.hoofdlijnenRootKey]: fromHoofdlijnen.initialState,
    [fromKaarten.kaartenRootKey]: fromKaarten.initialState,
    [fromIdealisatie.featureKey]: fromIdealisatie.initialState,
    [fromBestemmingsplanFeatures.bestemmingsplanFeaturesRootKey]: fromBestemmingsplanFeatures.initialState,
  },
};
