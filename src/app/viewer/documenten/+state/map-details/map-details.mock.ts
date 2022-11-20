import Feature, { FeatureLike } from 'ol/Feature';
import { Point } from 'ol/geom';
import { CartografieSummaryCollectie } from '~ihr-model/cartografieSummaryCollectie';
import { IMROCartografieInfoVM } from '~viewer/documenten/types/map-details';

export const mapDetailsVMMockBP: IMROCartografieInfoVM[] = [
  {
    naam: 'Plankaart',
    nummer: 1,
    details: [
      {
        categorie: 'Enkelbestemming',
        classificatie: 'overig',
        naam: 'Recreatie - Gemengd terrein',
        id: 'NL.IMRO.506d8681383f47ef8bdad01fd126811d',
        type: 'Enkelbestemming',
        symboolcode: 'enkelbestemming_overig',
        labels: ['Recreatie - Gemengd terrein'],
        selected: true,
      },
      {
        categorie: 'Enkelbestemming',
        classificatie: 'bos',
        naam: 'Bos',
        id: 'NL.IMRO.75c9e83b101342d18e3734b68ba5427b',
        type: 'Enkelbestemming',
        symboolcode: 'enkelbestemming_bos',
        labels: ['Bos'],
        selected: true,
      },
      {
        categorie: 'Gebiedsaanduiding',
        classificatie: 'overige zone',
        naam: 'overige zone - bufferzone verdroging',
        id: 'NL.IMRO.13ba461668d74ae2bd7ada135d344bec',
        type: 'Gebiedsaanduiding',
        symboolcode: 'gebiedsaanduiding_overige_zone',
        labels: ['overige zone - bufferzone verdroging'],
        selected: true,
      },
      {
        categorie: 'Gebiedsaanduiding',
        classificatie: 'milieuzone',
        naam: 'milieuzone - grondwaterbescherming venlo schol',
        id: 'NL.IMRO.3b055d206a904bca8034f0c69335a440',
        type: 'Gebiedsaanduiding',
        symboolcode: 'gebiedsaanduiding_milieuzone',
        labels: ['milieuzone - grondwaterbescherming venlo schol'],
        selected: true,
      },
      {
        categorie: 'Gebiedsaanduiding',
        classificatie: 'overige zone',
        naam: 'overige zone - goudgroene natuurzone',
        id: 'NL.IMRO.8e9659dbbda441e58893e39b434838b1',
        type: 'Gebiedsaanduiding',
        symboolcode: 'gebiedsaanduiding_overige_zone',
        labels: ['overige zone - goudgroene natuurzone'],
        selected: true,
      },
      {
        categorie: 'Enkelbestemming',
        classificatie: 'bos',
        naam: 'Bos',
        id: 'NL.IMRO.9ffd3ee5335e4f20a3275fc7af8d7b1e',
        type: 'Enkelbestemming',
        symboolcode: 'enkelbestemming_bos',
        labels: ['Bos'],
        selected: true,
      },
      {
        categorie: 'Enkelbestemming',
        classificatie: 'overig',
        naam: 'Recreatie - Gemengd terrein',
        id: 'NL.IMRO.9e804e770d31453986bb9799427adf66',
        type: 'Enkelbestemming',
        symboolcode: 'enkelbestemming_overig',
        labels: ['Recreatie - Gemengd terrein'],
        selected: true,
      },
      {
        categorie: 'Gebiedsaanduiding',
        classificatie: 'overige zone',
        naam: 'overige zone - steilrand',
        id: 'NL.IMRO.6a06b1de81cb4ab2a2e191b66c914268',
        type: 'Gebiedsaanduiding',
        symboolcode: 'gebiedsaanduiding_overige_zone',
        labels: ['overige zone - steilrand'],
        selected: true,
      },
      {
        categorie: 'Enkelbestemming',
        classificatie: 'water',
        naam: 'Water',
        id: 'NL.IMRO.cc63283101d94e118a4f43e437e04dac',
        type: 'Enkelbestemming',
        symboolcode: 'enkelbestemming_water',
        labels: ['Water'],
        selected: true,
      },
    ],
  },
];

export const featuresMock: FeatureLike[] = [new Feature({ geometry: new Point([0, 0]), objectId: 'id' })];

const feat1 = {
  type: 'Enkelbestemming',
  objectid: 'NL.IMRO.30263f9c789143a68b352151d9aeb4bb',
  naam: 'Wonen',
  planid: 'NL.IMRO.0200.bp1148-vas1',
  categorie: 'Enkelbestemming',
  classificatie: 'wonen',
  layer: 'planobject_polygon',
};

const feat2 = {
  type: 'Gebiedsaanduiding',
  objectid: 'NL.IMRO.40993086d3fd434a888f9b2e3a5bfde3',
  naam: 'wetgevingzone - wijzigingsgebied 1',
  planid: 'NL.IMRO.0200.bp1148-vas1',
  categorie: 'Gebiedsaanduiding',
  classificatie: 'wetgevingzone',
  layer: 'planobject_polygon',
};

const feat3 = {
  type: 'Gebiedsaanduiding',
  objectid: 'NL.IMRO.35916c0aed1849c0b3d41967969294e8',
  naam: 'overige zone - hoge archeologische verwachtingswaarde',
  planid: 'NL.IMRO.0200.bp1148-vas1',
  categorie: 'Gebiedsaanduiding',
  classificatie: 'overige zone',
  layer: 'planobject_polygon',
};

const feat4 = {
  layer: 'planobject_linestring',
  naam: 'hartlijn leiding - hoogspanningsverbinding',
  objectid: 'NL.IMRO.90ef8b1eddfa4056b1571a0f28048e6c',
  planid: 'NL.IMRO.0301.op0101Landelijkgeb-vs01',
  categorie: 'Figuur',
  type: 'Figuur',
};

export const featuresBPMock = [
  { getProperties: () => feat1 },
  { getProperties: () => feat2 },
  { getProperties: () => feat3 },
  { getProperties: () => feat4 },
];

export const cartografieSummaryCollectieMock: CartografieSummaryCollectie = {
  _embedded: {
    cartografiesummaries: [
      {
        thema: ['other: algemeen'],
        verwijzingNaarTekst: [
          'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.sed0c077d-b839-4f73-b6b2-e80c2eedfd1a',
          'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.s40673bc3-bd5e-4c0e-8206-bf437233d167',
        ],
        objectNaam: 'Omgevingsvisie Gaaf Gelderland',
        cartografieInfo: [
          {
            symboolCode: 'AS027',
            kaartnummer: 1,
            kaartnaam: 'Omgevingsvisie Gaaf Gelderland',
          },
        ],
        objectId: 'NL.IMRO.9925PRIMA201200000005392',
        objectType: 'structuurvisiegebied',
      },
      {
        thema: ['energie'],
        verwijzingNaarTekst: [
          'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.s2739029f-7414-4874-8d95-a6c4ace31911',
        ],
        objectNaam: 'Grote zonneparken mogelijk',
        cartografieInfo: [
          {
            symboolCode: 'S036',
            kaartnummer: 2,
            kaartnaam: 'Themakaart Ruimtelijk beleid',
          },
        ],
        objectId: 'NL.IMRO.9925PRIMA201200000005469',
        objectType: 'structuurvisiegebied',
      },
      {
        thema: ['energie'],
        verwijzingNaarTekst: [
          'https://ruimtelijkeplannen.nl/documents/NL.IMRO.9925.SVOmgvisieGG-vst1/pt_NL.IMRO.9925.SVOmgvisieGG-vst1.xml#NL.IMRO.PT.scb35f82f-2797-468f-9910-d99d81214c09',
        ],
        objectNaam: 'Windenergie mogelijk',
        cartografieInfo: [
          {
            symboolCode: 'AS224',
            kaartnummer: 2,
            kaartnaam: 'Themakaart Ruimtelijk beleid',
          },
        ],
        objectId: 'NL.IMRO.9925PRIMA201200000005497',
        objectType: 'structuurvisiegebied',
      },
    ],
  },
  _links: {
    self: {
      href: 'https://ruimte.omgevingswet.overheid.nl/plannen/NL.IMRO.9925.SVOmgvisieGG-vst1/cartografiesummaries',
    },
  },
};
