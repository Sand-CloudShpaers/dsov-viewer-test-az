import { Suggestion } from '@dso-toolkit/core/dist/types/components/autosuggest/autosuggest';
import { FilterIdentification } from '~viewer/filter/types/filter-options';

export interface ActiviteitSuggestion extends Suggestion {
  filterIdentification: FilterIdentification;
}
