import { createSelector, MemoizedSelector } from '@ngrx/store';
import { derivedLoadingState, DerivedLoadingState } from '~general/utils/store.utils';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import { StructuurElementFilter } from './structuurelement-filter.model';
import * as fromDocumentStructuurelementenFilter from './structuurelement-filter.reducer';

const getFilterState = createSelector(
  selectDocumentenState,
  state => state[fromDocumentStructuurelementenFilter.documentStructuurelementFilterFeatureKey]
);

export const { selectEntities: selectFilterEntities } =
  fromDocumentStructuurelementenFilter.adapter.getSelectors(getFilterState);

export const getStatus = (documentId: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(selectFilterEntities, entities => derivedLoadingState(entities[documentId]?.status));

export const getFilterByDocumentId = (documentId: string): MemoizedSelector<State, StructuurElementFilter> =>
  createSelector(selectFilterEntities, entities => entities[documentId]?.data);
