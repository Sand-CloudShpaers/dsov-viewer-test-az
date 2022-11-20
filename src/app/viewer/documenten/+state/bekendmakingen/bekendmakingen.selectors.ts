import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromBekendmakingen from './bekendmakingen.reducer';
import { BekendmakingVM } from '~viewer/documenten/components/bekendmakingen/bekendmakingen.model';

const getBekenmakingenState = createSelector(
  selectDocumentenState,
  state => state[fromBekendmakingen.bekendmakingenFeatureKey]
);

const { selectEntities: selectBekendmakingenEntities } = fromBekendmakingen.adapter.getSelectors(getBekenmakingenState);

export const selectBekendmakingenByDocumentId = (documentId: string): MemoizedSelector<State, BekendmakingVM[]> =>
  createSelector(
    selectBekendmakingenEntities,
    (bekendmakingenEntities): BekendmakingVM[] =>
      bekendmakingenEntities[documentId]?.data?.bekendmakingen?.map(item => ({
        documentType: item.documentType,
        href: item.href,
        titel: item.titel,
      })) || []
  );
