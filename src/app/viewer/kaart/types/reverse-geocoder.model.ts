export interface ReverseGeocoderResponse {
  response: Response;
}

interface Response {
  numFound: number;
  start: number;
  maxScore: number;
  docs: Doc[];
}

interface Doc {
  type: string;
  weergavenaam: string;
  id: string;
  score: number;
  afstand: number;
}
