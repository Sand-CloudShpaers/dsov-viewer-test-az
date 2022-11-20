import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectRegelsOpMaatState, State as fromRegelsOpMaatState } from '~viewer/regels-op-maat/+state';
import * as fromDocument from './document.reducer';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { LoadMoreLinks } from '~viewer/regels-op-maat/types/load-more-links';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';

const getRegelsOpMaatDocumentState = createSelector(
  selectRegelsOpMaatState,
  state => state[fromDocument.documentFeatureKey]
);

const { selectEntities: selectDocumentEntities } = fromDocument.adapter.getSelectors(getRegelsOpMaatDocumentState);

export const selectDocumentStatus = (
  documentId: string
): MemoizedSelector<fromRegelsOpMaatState, DerivedLoadingState> =>
  createSelector(selectDocumentEntities, entities => derivedLoadingState(entities[documentId]?.status));

export const selectDocument = (documentId: string): MemoizedSelector<fromRegelsOpMaatState, RegelsOpMaatDocument> =>
  createSelector(selectDocumentEntities, entities => entities[documentId]?.data);

export const selectLoadMoreStatus = (
  documentId: string
): MemoizedSelector<fromRegelsOpMaatState, DerivedLoadingState> =>
  createSelector(selectDocumentEntities, entities => derivedLoadingState(entities[documentId]?.data?.statusLoadMore));

export const selectLoadMore = (documentId: string): MemoizedSelector<fromRegelsOpMaatState, LoadMoreLinks> =>
  createSelector(selectDocumentEntities, entities => entities[documentId]?.data?.loadMoreLinks);

export const selectDocumentIds = createSelector(selectDocumentEntities, entities =>
  Object.values(entities).map(entity => entity.data.documentId)
);
