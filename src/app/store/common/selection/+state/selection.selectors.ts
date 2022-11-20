import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectCommonState, State } from '~store/common';
import * as fromSelection from './selection.reducer';
import { ApiSource } from '~model/internal/api-source';
import { LegendGroupVM } from '~viewer/kaart/components/legenda/types/legend-group';
import striptags from 'striptags';
import { SelectionObjectType } from '../selection.model';
import { uniqueObjects } from '~general/utils/array.utils';

const getSelectionState = createSelector(selectCommonState, state => state[fromSelection.selectionFeatureKey]);

export const { selectEntities: selectSelectionEntities, selectAll: getSelections } =
  fromSelection.adapter.getSelectors(getSelectionState);

export const getSelectionByID = (id: string): MemoizedSelector<State, boolean> =>
  createSelector(selectSelectionEntities, entities => !!entities[id]);

export const selectSelections = createSelector(getSelections, selectionList =>
  selectionList.map(payload => payload.data)
);

export const selectOzonSelections = createSelector(getSelections, selectionList =>
  selectionList.map(payload => payload.data).filter(selection => selection.apiSource === ApiSource.OZON)
);

export const selectIhrSelections = createSelector(getSelections, selectionList =>
  selectionList.map(payload => payload.data).filter(selection => selection.apiSource === ApiSource.IHR)
);

export const selectIhrDocumentSelections = createSelector(getSelections, selectionList =>
  selectionList
    .map(payload => payload.data)
    .filter(selection => selection.apiSource === ApiSource.IHR && selection.documentDto)
);

export const selectDocumentSelections = createSelector(getSelections, selectionList =>
  selectionList.map(payload => payload.data).filter(selection => selection.documentDto)
);

export const selectLegend = createSelector(getSelections, selectionList => {
  /* Haal overbodig HTML elementen uit de beschrijving */
  const stripped = selectionList.map(item => ({ ...item.data, name: striptags(item.data.name) }));

  /* Zet alle regelingsgebieden vooraan en sorteer alle volgende op alfabet */
  const regelingsgebieden: LegendGroupVM[] = [
    {
      selections: stripped.filter((x, index) => x.objectType === SelectionObjectType.REGELINGSGEBIED && index === 0),
    },
  ];
  const other = stripped
    .filter(x => x.objectType !== SelectionObjectType.REGELINGSGEBIED)
    .sort((a, b) => a.name.localeCompare(b.name));

  const toNotBeGrouped: LegendGroupVM[] = uniqueObjects(
    other.filter(x => !x.parentName),
    'id'
  ).map(x => ({
    selections: [x],
  }));

  const toBeGrouped: LegendGroupVM[] = uniqueObjects(
    other.filter(x => x.parentName),
    'parentName'
  ).map(x => ({
    id: x.parentId,
    name: x.parentName,
    selections: other.filter(selection => selection.parentId === x.parentId),
  }));

  /* Voeg samen */
  return [...regelingsgebieden, ...toNotBeGrouped, ...toBeGrouped];
});
