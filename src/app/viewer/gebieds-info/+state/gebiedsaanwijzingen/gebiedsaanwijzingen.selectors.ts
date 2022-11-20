import { createSelector } from '@ngrx/store';
import { selectGebiedsInfoState } from '../index';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen.reducer';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { derivedLoadingState } from '~general/utils/store.utils';
import { getGebiedsaanwijzingenVMArray } from '~viewer/gebiedsaanwijzingen/helpers/gebiedsaanwijzingen';
import { sortByKey } from '~general/utils/group-by.utils';
import { selectSelections } from '~store/common/selection/+state/selection.selectors';

const { selectAll: selectGebiedsaanwijzingenState } = fromGebiedsaanwijzingen.adapter.getSelectors();

const getGebiedsaanwijzingenState = createSelector(
  selectGebiedsInfoState,
  state => state[fromGebiedsaanwijzingen.gebiedsaanwijzingenFeatureKey]
);

export const getGebiedsaanwijzingen = createSelector(getGebiedsaanwijzingenState, selectGebiedsaanwijzingenState);

const selectGebiedsaanwijzingenStatus = createSelector(getGebiedsaanwijzingenState, fromGebiedsaanwijzingen.getStatus);
export const getGebiedsaanwijzingenStatus = createSelector(selectGebiedsaanwijzingenStatus, derivedLoadingState);

export const selectGebiedsaanwijzingenVM = createSelector(
  getGebiedsaanwijzingen,
  selectSelections,
  (gebiedsaanwijzingen, selection) => {
    const output: GebiedsaanwijzingenVM[] = [];

    if (!gebiedsaanwijzingen) {
      return output;
    }

    const entity = gebiedsaanwijzingen.find(item => item.entityId === fromGebiedsaanwijzingen.entityId);
    if (!entity?.data) {
      return output;
    }

    return getGebiedsaanwijzingenVMArray(selection, entity.data);
  }
);

export const selectGebiedsaanwijzingenForOverzichtVM = createSelector(
  getGebiedsaanwijzingen,
  selectSelections,
  (entityPayload, selections) => {
    const entity = entityPayload?.find(item => item.entityId === fromGebiedsaanwijzingen.entityId);
    const gebiedsaanwijzingen = entity?.data?.gebiedsaanwijzingen;
    const functies = gebiedsaanwijzingen
      .filter(func => func.label === 'Functies')
      .map(item => {
        const selection = selections?.find(x => x.id === item.identificatie);
        return {
          identificatie: item.identificatie,
          naam: item.naam,
          groep: item.groep.waarde,
          href: `/gebiedsaanwijzingen/${item.identificatie}/locatietiles`,
          isSelected: !!selection,
          symboolcode: selection?.symboolcode,
          type: item.label,
        };
      });

    const beperkingsgebieden = gebiedsaanwijzingen
      .filter(gebied => gebied.label === 'Beperkingengebieden')
      .map(item => {
        const selection = selections?.find(x => x.id === item.identificatie);
        return {
          identificatie: item.identificatie,
          naam: item.naam,
          groep: item.groep.waarde,
          href: `/gebiedsaanwijzingen/${item.identificatie}/locatietiles`,
          isSelected: !!selection,
          symboolcode: selection?.symboolcode,
          type: item.label,
        };
      });
    // beperkingsgebieden en functies volgens alfabet
    return sortByKey(beperkingsgebieden, 'naam').concat(sortByKey(functies, 'naam'));
  }
);
