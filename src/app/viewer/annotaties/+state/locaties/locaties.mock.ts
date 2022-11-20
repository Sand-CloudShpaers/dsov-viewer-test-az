import { Locaties } from '~ozon-model/locaties';
import { Locatie } from '~ozon-model/locatie';

export const mockLocaties: Locatie[] = [
  {
    identificatie: 'abcdefg',
    noemer: 'Hoogheemraadschap De Stichtse Rijnlanden',
    locatieType: 'Gebiedengroep',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    omvat: {
      _embedded: {
        locaties: [
          {
            identificatie: 'abc',
            noemer: 'Hoogheemraadschap De Stichtse Rijnlanden',
            locatieType: 'Gebiedengroep',
            geregistreerdMet: {
              beginInwerking: '',
              beginGeldigheid: '',
              tijdstipRegistratie: '',
            },
          },
          {
            identificatie: 'defg',
            noemer: 'Hoogheemraadschap De Stichtse Rijnlanden',
            locatieType: 'Gebiedengroep',
            geregistreerdMet: {
              beginInwerking: '',
              beginGeldigheid: '',
              tijdstipRegistratie: '',
            },
          },
        ],
      },
      _links: {},
      page: {
        size: 1,
        totalElements: 1,
        totalPages: 1,
        number: 1,
      },
    },
  },
];

export const mockLocatiesResponse: Locaties = {
  _embedded: {
    locaties: mockLocaties,
  },
  _links: {},
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 1,
  },
};

export const mockEmptyLocatiesResponse: Locaties = {
  _embedded: {
    locaties: [],
  },
  _links: {},
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 1,
  },
};
