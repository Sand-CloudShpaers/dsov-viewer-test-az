import { createSelector } from '@ngrx/store';
import * as fromOmgevingsnormen from './omgevingsnormen.reducer';
import { selectGebiedsInfoState } from '../index';
import { derivedLoadingState } from '~general/utils/store.utils';
import { getOmgevingsnormenArray } from '~viewer/annotaties/helpers/omgevingsnormen';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { selectSelections } from '~store/common/selection/+state/selection.selectors';
import { getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';

const { selectAll: selectOmgevingsnormenState } = fromOmgevingsnormen.adapter.getSelectors();

const getOmgevingsnormenState = createSelector(
  selectGebiedsInfoState,
  state => state[fromOmgevingsnormen.omgevingsnormenFeatureKey]
);

export const getOmgevingsnormen = createSelector(getOmgevingsnormenState, selectOmgevingsnormenState);

const selectOmgevingsnormenStatus = createSelector(getOmgevingsnormenState, fromOmgevingsnormen.getStatus);
export const getOmgevingsnormenStatus = createSelector(selectOmgevingsnormenStatus, derivedLoadingState);

export const selectOmgevingsnormenVM = createSelector(
  getOmgevingsnormen,
  selectSelections,
  getOzonLocaties,
  (entityPayload, selections, ozonLocaties) => {
    if (!entityPayload) {
      return [];
    }

    const entity = entityPayload.find(item => item.entityId === fromOmgevingsnormen.entityId);
    if (!entity?.data) {
      return [];
    }

    return getOmgevingsnormenArray(entity.data, [], NormType.OMGEVINGSNORMEN, selections, ozonLocaties);
  }
);
