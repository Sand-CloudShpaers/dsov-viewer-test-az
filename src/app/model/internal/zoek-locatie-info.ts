import { Geometry } from 'ol/geom';

export interface ZoekLocatieNaam {
  weergavenaam: string;
  pdokid: string;
}

export interface ZoekLocatieInfo {
  coordinaten?: ZoekLocatieCoordinates;
  gemeente?: ZoekLocatieNaam;
  adres?: ZoekLocatieNaam;
  perceel?: ZoekLocatieNaam;
  pdokId?: string;
  noZoom?: boolean;

  contour?: Geometry;
  geometrie?: Geometry;
}

export interface ZoekLocatieCoordinates {
  [ZoekLocatieSystem.RD]?: number[];
  [ZoekLocatieSystem.ETRS89]?: number[];
  system: ZoekLocatieSystem;
  invalid?: boolean;
}

export enum ZoekLocatieSystem {
  RD = 'RD',
  ETRS89 = 'ETRS89',
}
