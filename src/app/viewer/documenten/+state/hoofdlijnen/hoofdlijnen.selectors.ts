import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromHoofdlijnen from './hoofdlijnen.reducer';
import { derivedLoadingState } from '~general/utils/store.utils';
import { deepGroupBy, sortByKey, sortGroupByKeys } from '~general/utils/group-by.utils';
import { HoofdlijnVM } from './hoofdlijnen.model';

const getHoofdlijnenState = createSelector(selectDocumentenState, state => state[fromHoofdlijnen.hoofdlijnFeatureKey]);

const { selectEntities: selectHoofdlijnenEntities } = fromHoofdlijnen.adapter.getSelectors(getHoofdlijnenState);

const selectHoofdlijnenStatus = createSelector(getHoofdlijnenState, fromHoofdlijnen.getStatus);
export const getHoofdlijnenStatus = createSelector(selectHoofdlijnenStatus, derivedLoadingState);

export const selectHoofdlijnenByDocumentId = (
  documentId: string
): MemoizedSelector<State, Record<string, HoofdlijnVM[]>> =>
  createSelector(selectHoofdlijnenEntities, (entities): Record<string, HoofdlijnVM[]> => {
    const vastgesteld = entities[documentId]?.data.vastgesteld?._embedded.hoofdlijnen || [];
    const ontwerp = entities[documentId]?.data.ontwerp?._embedded.ontwerphoofdlijnen || [];

    const merged: HoofdlijnVM[] = [];
    [vastgesteld, ontwerp].forEach((list, index) => {
      list.forEach(hoofdlijn => {
        merged.push({
          identificatie: hoofdlijn.identificatie,
          naam: hoofdlijn.naam,
          soort: hoofdlijn.soort,
          isOntwerp: index === 1,
        });
      });
    });

    const sorted = sortByKey<HoofdlijnVM>(merged, 'naam');
    const grouped = deepGroupBy<HoofdlijnVM, keyof HoofdlijnVM>(sorted, 'soort');
    return sortGroupByKeys<HoofdlijnVM>(grouped);
  });
