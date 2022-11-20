export enum ServiceTypes {
  WMS = 'WMS',
  WMTS = 'WMTS',
  MVT = 'MVT',
}

export interface KaartlaagConfiguratie {
  id: string;
  type: ServiceTypes;
  serviceUrl: string;
  initialVisible: boolean;
  initialOpacity?: number;
  maxResolution?: number;
  minResolution?: number;
  zIndex?: number;
  tileformat?: string;
  planType?: string;
  serviceParameters?: {
    layer: string;
    matrixSet: string;
  };
  layercontrol?: {
    icon?: string;
    title?: string;
  };
  groupName?: string;
  declutter?: boolean;
}

export interface LayerConfigFormat {
  achtergrondlagen: KaartlaagConfiguratie[];
  informatielagen: KaartlaagConfiguratie[];
  omgevingsdocumentlagen: KaartlaagConfiguratie[];
  ruimtelijkeplannenlagen: KaartlaagConfiguratie;
}
