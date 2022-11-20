import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import * as fromSearchDocuments from './search-documents.reducer';
import { DocumentSuggestion } from '~search-documents/types/document-suggestion';
import { derivedLoadingState, DerivedLoadingState } from '~general/utils/store.utils';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { State } from '~store/state';
import { PlanSuggestieMap } from '~search-documents/types/planSuggestie';
import { SuggestieMap } from '~search-documents/types/suggestie';
import { SearchDocumentsConstraints } from '~search-documents/search-documents.enum';
import { RegelingSuggestie } from '~ozon-model/regelingSuggestie';

const featureSelector = createFeatureSelector<fromSearchDocuments.State>(fromSearchDocuments.featureKey);

export const getSuggestionStatus = createSelector(
  featureSelector,
  (state): DerivedLoadingState => derivedLoadingState(state.status)
);

export const getSuggestions = (documentTypes: Documenttype[]): MemoizedSelector<State, DocumentSuggestion[]> =>
  createSelector(featureSelector, (state): DocumentSuggestion[] => mapSuggestions(state, documentTypes));

const mapSuggestions = (state: fromSearchDocuments.State, documentTypes: Documenttype[]): DocumentSuggestion[] => {
  const plannenSelectorData =
    state.plannen?._embedded?.suggesties?.map(planSuggestie => new PlanSuggestieMap(planSuggestie).getSelectorData()) ||
    [];

  const regelingenSelectorData =
    state.regelingen?._embedded?.suggesties?.map((suggestie: RegelingSuggestie) =>
      new SuggestieMap(suggestie).getSelectorData(documentTypes)
    ) || [];

  return []
    .concat(plannenSelectorData, regelingenSelectorData)
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, SearchDocumentsConstraints.MAX_RESULTS);
};
