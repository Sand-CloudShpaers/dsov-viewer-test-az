import { ApiSource } from '~model/internal/api-source';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { Geometry } from 'ol/geom';
import { Huisnummer } from '~model/huisnummer';
import { LocationType } from '~model/internal/active-location-type.model';
import { ZoekLocatieCoordinates } from '~model/internal/zoek-locatie-info';
import { SelectionObjectType } from '~store/common/selection/selection.model';

export enum FilterName {
  LOCATIE = 'locatie',
  ACTIVITEIT = 'activiteit',
  THEMA = 'thema',
  GEBIEDEN = 'gebieden',
  DOCUMENTEN = 'documenten',
  DOCUMENT_TYPE = 'document_type',
  REGELGEVING_TYPE = 'regelgeving_type',
  REGELSBELEID = 'regelsbeleid',
  DATUM = 'datum',
}

export interface FilterOptions {
  [FilterName.LOCATIE]?: LocatieFilter[];
  [FilterName.ACTIVITEIT]?: FilterIdentification[];
  [FilterName.GEBIEDEN]?: GebiedenFilter[];
  [FilterName.DOCUMENTEN]?: DocumentenFilter[];
  [FilterName.THEMA]?: FilterIdentification[];
  [FilterName.DOCUMENT_TYPE]?: FilterIdentification[];
  [FilterName.REGELGEVING_TYPE]?: FilterIdentification[];
  [FilterName.REGELSBELEID]?: FilterIdentification[];
  [FilterName.DATUM]?: FilterIdentification[];
}

export type NamedFilter = {
  name: FilterName;
  filter: FilterIdentification | DocumentenFilter | RegelgevingtypeFilter | LocatieFilter;
};

export interface FilterLabel {
  hide?: boolean;
  name?: string;
  removable?: boolean;
}

export interface FilterIdentification {
  id: string;
  name: string;
  timeTravelDate?: string;
  document?: DocumentDto;
  group?: string;
  applicableToSources?: ApiSource[];
  default?: boolean;
  ozonValue?: string;
  label?: FilterLabel;
}

export interface DocumentenFilter extends FilterIdentification {
  document: DocumentDto;
}

export interface LocatieFilter extends FilterIdentification {
  geometry: Geometry;
  gemeentecode?: string;
  huisnummer?: Huisnummer;
  straat?: string;
  postcode?: string;
  source?: LocationType;
  perceelcode?: string;
  woonplaatscode?: string;
  woonplaatsnaam?: string;
  provincie?: string;
  pdokId?: string;
  coordinaten?: ZoekLocatieCoordinates;
  contour?: Geometry;
  shouldBuffer?: boolean;
  noZoom?: boolean;
}

export interface RegelgevingtypeFilter extends FilterIdentification {
  items?: RegelgevingtypeItem[];
  labelAllItems?: string;
}

export interface GebiedenFilter extends FilterIdentification {
  objectType: SelectionObjectType;
}

export interface RegelgevingtypeItem {
  name: string;
  id: string;
  selected?: boolean;
}
