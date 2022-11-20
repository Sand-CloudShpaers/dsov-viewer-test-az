import { createSelector } from '@ngrx/store';
import { selectRegelsOpMaatState } from '~viewer/regels-op-maat/+state';
import { derivedLoadingState } from '~general/utils/store.utils';
import * as fromRegelsOpMaat from './regels-op-maat.reducer';

const getRegelsOpMaatState = createSelector(
  selectRegelsOpMaatState,
  state => state[fromRegelsOpMaat.regelsOpMaatFeatureKey]
);

export const selectRegelsOpMaatStatus = createSelector(getRegelsOpMaatState, status =>
  derivedLoadingState(status.loadingState)
);
