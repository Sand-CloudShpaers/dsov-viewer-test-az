import { Suggestion } from '@dso-toolkit/core/dist/types/components/autosuggest/autosuggest';
import { LocationType } from '~model/internal/active-location-type.model';

export interface LocationSuggestion extends Suggestion {
  source: LocationType;
  name: string;
  pdokId: string;
}
