import { Bestemmingsvlak } from '~ihr-model/bestemmingsvlak';
import { Gebiedsaanduiding } from '~ihr-model/gebiedsaanduiding';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { BestemmingsplanFeatureGroupVM } from '~viewer/annotaties/types/bestemmingsplan-features';

export const bestemmingsvlakMock: Bestemmingsvlak = {
  bestemmingshoofdgroep: 'agrarisch',
  labelInfo: 'A-1',
  _links: null,
  verwijzingNaarTekst: [
    'https://ruimtelijkeplannen.nl/documents/NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01/r_NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01.html#_3_Agrarisch-1',
  ],
  bestemmingsfuncties: [],
  id: 'NL.IMRO.e6c3f7a586ac46e49251312072dcbe92',
  type: 'enkelbestemming',
  naam: 'Agrarisch - 1',
  artikelnummer: '3',
};

export const gebiedsaanduidingMock: Gebiedsaanduiding = {
  labelInfo: 'A-1',
  verwijzingNaarTekst: [
    'https://ruimtelijkeplannen.nl/documents/NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01/r_NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01.html#_3_Agrarisch-1',
  ],
  _links: null,
  bestemmingsfuncties: [],
  id: 'NL.IMRO.e6c3f7a586ac46ewewqeerewrewr',
  naam: 'aanduiding',
  artikelnummers: ['3'],
  gebiedsaanduidinggroep: 'groep',
};

export const BestemmingsplanFeatureEntitiesMock = {
  'NL.IMRO.PT.regels._3_Agrarisch-1': {
    entityId: 'NL.IMRO.PT.regels._3_Agrarisch-1',
    status: 'RESOLVED',
    data: [
      {
        objectType: SelectionObjectType.BESTEMMINGSVLAK,
        documentId: 'NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01',
        feature: bestemmingsvlakMock,
      },
      {
        objectType: SelectionObjectType.GEBIEDSAANDUIDING,
        documentId: 'NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01',
        feature: gebiedsaanduidingMock,
      },
      {
        objectType: SelectionObjectType.GEBIEDSAANDUIDING,
        documentId: 'NL.IMRO.1774.BUIBPOUDEPOSTWG2-VG01',
        feature: gebiedsaanduidingMock,
      },
    ],
  },
};

export const BestemmingsplanFeatureGroupVMMocks: BestemmingsplanFeatureGroupVM[] = [
  {
    id: SelectionObjectType.BESTEMMINGSVLAK,
    objectType: SelectionObjectType.BESTEMMINGSVLAK,
    features: [
      {
        id: 'bestemmingsvlak',
        naam: 'Leuke bestemmingsvlak',
        locatieIds: ['bestemmingsvlak'],
        symboolcode: 'symbool_code_1',
        isSelected: true,
      },
    ],
  },
  {
    id: SelectionObjectType.BOUWAANDUIDING,
    objectType: SelectionObjectType.BOUWAANDUIDING,
    features: [
      {
        id: 'bouwaanduiding',
        naam: 'Leuke bouwaanduiding',
        locatieIds: ['bouwaanduiding'],
        symboolcode: 'symbool_code_2',
        isSelected: true,
      },
    ],
  },
  {
    id: SelectionObjectType.FUNCTIEAANDUIDING,
    objectType: SelectionObjectType.FUNCTIEAANDUIDING,
    features: [
      {
        id: 'functieaanduiding',
        naam: 'Leuke functieaanduiding',
        locatieIds: ['functieaanduiding'],
        symboolcode: 'symbool_code_3',
        isSelected: true,
      },
    ],
  },
  {
    id: SelectionObjectType.GEBIEDSAANDUIDING,
    objectType: SelectionObjectType.GEBIEDSAANDUIDING,
    features: [
      {
        id: 'gebiedsaanduiding',
        naam: 'Leuke gebiedsaanduiding',
        locatieIds: ['gebiedsaanduiding'],
        symboolcode: 'symbool_code_4',
        isSelected: true,
      },
    ],
  },
  {
    id: SelectionObjectType.LETTERTEKENAANDUIDING,
    objectType: SelectionObjectType.LETTERTEKENAANDUIDING,
    features: [
      {
        id: 'letteraanduiding',
        naam: 'Leuke letteraanduiding',
        locatieIds: ['letteraanduiding'],
        symboolcode: 'symbool_code_5',
        isSelected: true,
      },
    ],
  },
  {
    id: SelectionObjectType.MAATVOERING,
    objectType: SelectionObjectType.MAATVOERING,
    features: [
      {
        id: 'maatvoering',
        naam: 'Leuke maatvoering',
        locatieIds: ['maatvoering'],
        symboolcode: 'symbool_code_6',
        isSelected: true,
      },
    ],
  },
];
