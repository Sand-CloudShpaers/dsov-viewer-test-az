import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromGerelateerdePlannen from './gerelateerde-plannen.reducer';
import { derivedLoadingState } from '~general/utils/store.utils';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { getDocumentVM } from '~viewer/documenten/utils/document-utils';

const getGerelateerdePlannenState = createSelector(
  selectDocumentenState,
  state => state[fromGerelateerdePlannen.gerelateerdePlannenFeatureKey]
);

const { selectEntities: selectGerelateerdePlannenEntities } =
  fromGerelateerdePlannen.adapter.getSelectors(getGerelateerdePlannenState);

const selectGerelateerdePlannenStatus = createSelector(getGerelateerdePlannenState, fromGerelateerdePlannen.getStatus);
export const getGerelateerdePlannenStatus = createSelector(selectGerelateerdePlannenStatus, derivedLoadingState);

export const getGerelateerdePlannen = (documentId: string): MemoizedSelector<State, DocumentVM[]> =>
  createSelector(selectGerelateerdePlannenEntities, (entities): DocumentVM[] =>
    entities[documentId]?.data?.gerelateerdePlannen?.map(plan => getDocumentVM(plan))
  );

export const getGerelateerdVanuit = (documentId: string): MemoizedSelector<State, DocumentVM[]> =>
  createSelector(selectGerelateerdePlannenEntities, (entities): DocumentVM[] =>
    entities[documentId]?.data?.gerelateerdVanuit?.map(plan => getDocumentVM(plan))
  );

export const getDossierPlannen = (documentId: string): MemoizedSelector<State, DocumentVM[]> =>
  createSelector(selectGerelateerdePlannenEntities, (entities): DocumentVM[] => {
    const documenten = entities[documentId]?.data?.dossier
      ?.filter(plan => plan.id !== documentId)
      .map(plan => getDocumentVM(plan));
    return documenten?.length ? documenten : undefined;
  });
