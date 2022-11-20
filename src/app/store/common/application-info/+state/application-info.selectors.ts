import { createSelector } from '@ngrx/store';
import {
  IhrSpecificationVersion,
  OzonPresenterenSpecificationVersion,
  OzonVerbeeldenSpecificationVersion,
} from '~config/specification-version';
import { derivedLoadingState } from '~general/utils/store.utils';
import { selectCommonState } from '~store/common';
import { ApplicationInfo } from '../types/application-info';
import * as fromApplicationInfo from './application-info.reducer';

export const getApplicationInfoState = createSelector(
  selectCommonState,
  state => state[fromApplicationInfo.featureKey]
);

export const selectStatus = createSelector(getApplicationInfoState, state => derivedLoadingState(state.status));

export const selectApplicationInfo = createSelector(getApplicationInfoState, (state): ApplicationInfo[] =>
  state?.ozonPresenteren?.app && state?.ozonVerbeelden?.app && state?.ihr
    ? [
        {
          version: state.ozonPresenteren.app.version,
          name: 'Presenteren API',
          models: [
            {
              version: OzonPresenterenSpecificationVersion,
              name: 'In gebruik',
            },
            {
              version: state.ozonPresenteren.app.cimowVersion,
              name: 'CIMOW',
            },
            {
              version: state.ozonPresenteren.app.stopVersion,
              name: 'STOP',
            },
          ],
        },
        {
          version: state.ozonVerbeelden.app.version,
          name: 'Verbeelden API',
          models: [
            {
              version: OzonVerbeeldenSpecificationVersion,
              name: 'In gebruik',
            },
          ],
        },
        {
          version: state.ihr.version,
          name: 'Ruimtelijke Plannen API',
          models: [
            {
              version: IhrSpecificationVersion,
              name: 'In gebruik',
            },
          ],
        },
      ]
    : undefined
);
