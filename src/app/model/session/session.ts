import { GeoJsonGeometryResponse } from '~model/geo-json-geometry-response';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';

export interface SessionMessageHistory {
  type: SessionType.REQ_PUSH_HISTORY | SessionType.RES_PUSH_HISTORY;
  eventStatus?: 'OK';
  value: string;
  timestamp?: number;
}

export interface REQ_GET_SESSION_DATA {
  type: SessionType.REQ_GET_SESSION_DATA;
  dataType: DataType.LOCATIE | DataType.ACTIVITEITEN;
}

export interface RES_GET_SESSION_DATA {
  type: SessionType.RES_GET_SESSION_DATA;
  eventStatus?: 'OK';
  value?: {
    dataType: DataType.LOCATIE | DataType.ACTIVITEITEN;
    version?: string;
    data?: SessionLocatie | Activiteit[];
  };
}

export interface REQ_PUT_SESSION_DATA {
  type: SessionType.REQ_PUT_SESSION_DATA;
  eventStatus?: 'OK';
  dataType: DataType.LOCATIE | DataType.ACTIVITEITEN;
  version?: string;
  data: SessionLocatie | Activiteit[];
}

export interface SessionLocatie {
  rd?: GeoJsonGeometryResponse;
  wgs84?: GeoJsonGeometryResponse;
  label: string;
  source?: SessionSource;
}

export interface SessionSource {
  address?: Address;
  postalcode?: Postalcode;
  cadastral?: Cadastral;
  coordinate?: Coordinate;
  contour?: Contour;
}

export enum SessionType {
  REQ_GET_SESSION_DATA = 'REQ_GET_SESSION_DATA',
  RES_GET_SESSION_DATA = 'RES_GET_SESSION_DATA',
  REQ_PUT_SESSION_DATA = 'REQ_PUT_SESSION_DATA',
  REQ_PUSH_HISTORY = 'REQ_PUSH_HISTORY',
  RES_PUSH_HISTORY = 'RES_PUSH_HISTORY',
}

export enum DataType {
  ACTIVITEITEN = 'ACTIVITEITEN',
  LOCATIE = 'LOCATIE',
}

export interface Activiteit {
  functionalStructureRef: string;
  urn: string;
  activityName: string;
  subActivities?: Activiteit[];
}

interface Address {
  numberindicationId: string;
  street: string;
  number: string;
  zipcode: string;
  residence: string;
  pdokId: string;
}

interface Postalcode {
  numberindicationId: string;
  zipcode: string;
  number: string;
  pdokId: string;
}

interface Cadastral {
  municipalityCode?: string;
  section?: string;
  lotnumber?: string;
  pdokId?: string;
}

interface Coordinate {
  system: ZoekLocatieSystem;
  geometry: {
    type: 'Point';
    coordinates: number[];
  };
}

interface Contour {
  system: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[];
  };
}
