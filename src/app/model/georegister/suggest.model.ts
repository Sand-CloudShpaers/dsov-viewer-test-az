import { Document } from '../internal/document/types/document';
import { LocationType } from '../internal/active-location-type.model';

export interface SuggestResponseBody {
  response: SuggestResponse;
  highlighting: { [key: string]: SuggestHighlighting };
  spellcheck: SuggestSpellcheck;
}

interface SuggestHighlighting {
  suggest: string[];
}

interface SuggestResponse {
  numFound: number;
  start: number;
  maxScore: number;
  docs: SuggestDoc[];
}

export interface SuggestDoc {
  type: LocationType;
  weergavenaam: string;
  id: string;
  score?: number;
  plan?: Document;
  coordinates?: number[];
}

interface SuggestSpellcheck {
  suggestions: Array<SuggestionClass | string>;
  collations: string[];
}

interface SuggestionClass {
  numFound: number;
  startOffset: number;
  endOffset: number;
  suggestion: string[];
}
