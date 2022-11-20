import { createSelector } from '@ngrx/store';
import * as fromCommon from '~store/common';
import { State } from '~store/common';
import * as fromOzonLocaties from './ozon-locaties.reducer';
import { derivedLoadingState } from '~general/utils/store.utils';

const getOzonLocatiesState = (state: State): fromOzonLocaties.State =>
  state[fromCommon.commonRootKey][fromOzonLocaties.ozonLocatiesRootKey];

export const selectOzonLocatiesStatus = createSelector(getOzonLocatiesState, state =>
  derivedLoadingState(state.status)
);

export const getOzonLocatiesError = (state: State): Error =>
  state[fromCommon.commonRootKey][fromOzonLocaties.ozonLocatiesRootKey].error;

export const getOzonLocaties = (state: State): string[] =>
  state[fromCommon.commonRootKey][fromOzonLocaties.ozonLocatiesRootKey].locatieIds;
export const getOzonOntwerpLocatieTechnischIds = (state: State): string[] =>
  state[fromCommon.commonRootKey][fromOzonLocaties.ozonLocatiesRootKey].ontwerpLocatieTechnischIds;
export const getOmgevingsplanPons = (state: State): boolean =>
  state[fromCommon.commonRootKey][fromOzonLocaties.ozonLocatiesRootKey].omgevingsplanPons;
