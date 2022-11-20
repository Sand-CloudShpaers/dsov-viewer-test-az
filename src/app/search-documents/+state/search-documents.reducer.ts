import { Action, createReducer, on } from '@ngrx/store';
import { PlanSuggestieCollectie } from '~ihr-model/planSuggestieCollectie';
import { LoadingState } from '~model/loading-state.enum';
import { RegelingSuggestieCollectie } from '~ozon-model/regelingSuggestieCollectie';
import * as SearchDocumentsActions from './search-documents.actions';

export const featureKey = 'search-documents';

export type State = {
  plannen: PlanSuggestieCollectie;
  regelingen: RegelingSuggestieCollectie;
  status: LoadingState;
  error?: Error;
};

export const initialState: State = {
  plannen: undefined,
  regelingen: undefined,
  status: LoadingState.RESOLVED,
};

const navigationReducer = createReducer(
  initialState,
  on(SearchDocumentsActions.SearchSuggestions, state => ({ ...state, status: LoadingState.PENDING })),
  on(SearchDocumentsActions.SearchSuggestionsSuccess, (_state, { plannen, regelingen }) => ({
    plannen,
    regelingen,
    status: LoadingState.RESOLVED,
  })),
  on(SearchDocumentsActions.SearchSuggestionsError, (_state, { error }) => ({
    ...initialState,
    error,
    status: LoadingState.REJECTED,
  })),
  on(SearchDocumentsActions.ResetSuggestions, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return navigationReducer(state, action);
}
