import { createAction, props } from '@ngrx/store';
import { PlanSuggestieCollectie } from '~ihr-model/planSuggestieCollectie';
import { RegelingSuggestieCollectie } from '~ozon-model/regelingSuggestieCollectie';

export const SearchSuggestions = createAction('[Search Documents] Search Suggestions', props<{ value: string }>());
export const SearchSuggestionsSuccess = createAction(
  '[Search Documents] Search Suggestions Success',
  props<{ regelingen: RegelingSuggestieCollectie; plannen: PlanSuggestieCollectie }>()
);
export const SearchSuggestionsError = createAction(
  '[Search Documents] Search Suggestions Error',
  props<{ value: string; error: Error }>()
);

export const ResetSuggestions = createAction('[Search Documents] Reset Suggestions');
