import { LocationType } from '../internal/active-location-type.model';

export interface PDOKLookupResponse {
  response: PDOKLookupResponseBody;
}

export interface PDOKLookupResponseBody {
  numFound: number;
  start: number;
  maxScore: number;
  docs: PDOKLookupDoc[];
}

export interface PDOKLookupDoc {
  bron: string;
  identificatie: string;
  geometrie_ll: string;
  provinciecode: string;
  type: LocationType;
  provincienaam: string;
  centroide_ll: string;
  gemeentecode: string;
  weergavenaam: string;
  suggest: string[];
  geometrie_rd: string;
  provincieafkorting: string;
  centroide_rd: string;
  id: string;
  gemeentenaam: string;
  _version_: number;
  typesortering: number;
  shard: string;
  woonplaatscode?: string;
  woonplaatsnaam?: string;
  rdf_seealso?: string;
  openbareruimtetype?: string;
  straatnaam_verkort?: string;
  openbareruimte_id?: string;
  straatnaam?: string;
  wijkcode?: string;
  huis_nlt?: string;
  buurtnaam?: string;
  gekoppeld_perceel?: string[];
  buurtcode?: string;
  wijknaam?: string;
  waterschapsnaam?: string;
  postcode?: string;
  nummeraanduiding_id?: string;
  waterschapscode?: string;
  adresseerbaarobject_id?: string;
  huisnummer?: number;
  sortering?: number;
}
