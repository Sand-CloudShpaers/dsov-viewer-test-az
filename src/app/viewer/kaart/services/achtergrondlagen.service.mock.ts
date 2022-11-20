import { KaartlaagConfiguratie, LayerConfigFormat, ServiceTypes } from '../types/kaartlaag-configuratie';

const achtergrondlagen: KaartlaagConfiguratie[] = [
  {
    id: 'brtachtergrondkaart',
    type: ServiceTypes.WMTS,
    serviceUrl: 'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?',
    serviceParameters: {
      layer: 'standaard',
      matrixSet: 'EPSG:28992',
    },
    initialVisible: true,
    layercontrol: {
      icon: 'legenda_basiskaart_brt.png',
      title: 'Basiskaart (BRT)',
    },
  },
  {
    id: 'bgtachtergrond',
    type: ServiceTypes.WMTS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/tiles/service/wmts?',
    serviceParameters: {
      layer: 'bgtachtergrond',
      matrixSet: 'EPSG:28992',
    },
    initialVisible: true,
    maxResolution: 0.84,
    layercontrol: {
      icon: 'legenda_basiskaart_bgt.png',
      title: 'Basiskaart (BGT)',
    },
  },
  {
    id: 'Actueel_ortho25',
    type: ServiceTypes.WMTS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/luchtfoto/rgb/wmts?',
    serviceParameters: {
      layer: 'Actueel_ortho25',
      matrixSet: 'EPSG:28992',
    },
    initialVisible: false,
    layercontrol: {
      icon: 'legenda_luchtfoto.png',
      title: 'Luchtfoto',
    },
  },
];

const informatielagen: KaartlaagConfiguratie[] = [
  {
    id: 'pand',
    type: ServiceTypes.WMS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/bag/wms/v1_1?',
    serviceParameters: {
      layer: 'pand',
      matrixSet: null,
    },
    initialVisible: false,
    maxResolution: 0.84,
    zIndex: 49,
    layercontrol: {
      icon: 'legenda_BAG panden.png',
      title: 'BAG pand',
    },
  },
  {
    id: 'kadastralekaart',
    type: ServiceTypes.WMS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/kadastralekaart/wms/v4_0?',
    serviceParameters: {
      layer: 'kadastralekaart',
      matrixSet: null,
    },
    initialVisible: false,
    maxResolution: 0.84,
    zIndex: 50,
    layercontrol: {
      icon: 'legenda_Kadastraal perceel.png',
      title: 'kadastraal perceel',
    },
  },
  {
    id: 'gemeenten',
    type: ServiceTypes.WMS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
    serviceParameters: {
      layer: 'gemeenten',
      matrixSet: null,
    },
    initialVisible: false,
    zIndex: 51,
    layercontrol: {
      icon: 'legenda_Gemeentegrenzen.png',
      title: 'gemeentegrens',
    },
  },
  {
    id: 'waterschapsgrens',
    type: ServiceTypes.WMS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/hwh/eenheden/wms/v1_0?style=au.AdministrativeUnitAlternative',
    serviceParameters: {
      layer: 'AU.AdministrativeUnit',
      matrixSet: null,
    },
    initialVisible: false,
    zIndex: 52,
    layercontrol: {
      icon: 'legenda_Gemeentegrenzen.png',
      title: 'waterschapsgrens',
    },
  },
  {
    id: 'provincies',
    type: ServiceTypes.WMS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
    serviceParameters: {
      layer: 'provincies',
      matrixSet: null,
    },
    initialVisible: false,
    zIndex: 53,
    layercontrol: {
      icon: 'legenda_Provinciegrenzen.png',
      title: 'provinciegrens',
    },
  },
  {
    id: 'landsgrens',
    type: ServiceTypes.WMS,
    serviceUrl: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?',
    serviceParameters: {
      layer: 'landsgrens',
      matrixSet: null,
    },
    initialVisible: false,
    zIndex: 54,
    layercontrol: {
      icon: 'legenda_Landsgrenzen.png',
      title: 'landsgrens',
    },
  },
];

const omgevingsdocumentlagen: KaartlaagConfiguratie[] = [
  {
    id: 'OzonVT',
    type: ServiceTypes.MVT,
    serviceUrl: 'https://service.pdok.nl/kadaster/ozon/wmts/v1_0-preprod/locaties/EPSG:28992/',
    initialVisible: false,
    initialOpacity: 0.3,
    maxResolution: 11,
    serviceParameters: {
      layer: '',
      matrixSet: '',
    },
  },
];

const ruimtelijkeplannenlagen: KaartlaagConfiguratie = {
  id: 'IhrVT',
  type: ServiceTypes.MVT,
  serviceUrl: 'https://service.pdok.nl/kadaster/ozon/wmts/v1_0-preprod/locaties/EPSG:28992/',
  initialVisible: false,
  initialOpacity: 0.3,
  maxResolution: 11,
  serviceParameters: {
    layer: '',
    matrixSet: '',
  },
};

export const layerConfig: LayerConfigFormat = {
  achtergrondlagen: achtergrondlagen,
  informatielagen: informatielagen,
  omgevingsdocumentlagen: omgevingsdocumentlagen,
  ruimtelijkeplannenlagen: ruimtelijkeplannenlagen,
};
