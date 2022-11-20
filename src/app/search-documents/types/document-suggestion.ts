import { Suggestion } from '@dso-toolkit/core/dist/types/components/autosuggest/autosuggest';
import { TimeTravelDates } from '~model/time-travel-dates';

export interface DocumentSuggestion extends Suggestion {
  id: string;
  date: Date;
  timeTravelDates?: TimeTravelDates;
}
