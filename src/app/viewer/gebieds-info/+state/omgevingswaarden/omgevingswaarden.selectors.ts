import { createSelector } from '@ngrx/store';
import * as fromOmgevingswaarden from './omgevingswaarden.reducer';
import { selectGebiedsInfoState } from '../index';
import { derivedLoadingState } from '~general/utils/store.utils';
import { getOmgevingsnormenArray } from '~viewer/annotaties/helpers/omgevingsnormen';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { selectSelections } from '~store/common/selection/+state/selection.selectors';

const { selectAll: selectOmgevingswaardenState } = fromOmgevingswaarden.adapter.getSelectors();

const getOmgevingswaardenState = createSelector(
  selectGebiedsInfoState,
  state => state[fromOmgevingswaarden.omgevingswaardenFeatureKey]
);

export const getOmgevingswaarden = createSelector(getOmgevingswaardenState, selectOmgevingswaardenState);

const selectOmgevingswaardenStatus = createSelector(getOmgevingswaardenState, fromOmgevingswaarden.getStatus);
export const getOmgevingswaardenStatus = createSelector(selectOmgevingswaardenStatus, derivedLoadingState);

export const selectOmgevingswaardenVM = createSelector(
  getOmgevingswaarden,
  selectSelections,
  (entityPayload, selections) => {
    if (!entityPayload) {
      return [];
    }

    const entity = entityPayload.find(item => item.entityId === fromOmgevingswaarden.entityId);
    if (!entity?.data) {
      return [];
    }

    return getOmgevingsnormenArray(entity.data, [], NormType.OMGEVINGSWAARDEN, selections);
  }
);
