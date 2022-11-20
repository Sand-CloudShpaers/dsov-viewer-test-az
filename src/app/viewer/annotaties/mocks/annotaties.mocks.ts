import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { Locatie } from '~ozon-model/locatie';
import { EntityPayload } from '~general/utils/state/entity-action';
import { LocatieVM } from '~viewer/annotaties/types/locatieVM';
import { HoofdlijnenEntity, OmgevingsnormenEntity, OmgevingswaardenEntity } from '~viewer/annotaties/types/entity';
import { Hoofdlijn } from '~ozon-model/hoofdlijn';
import { OntwerpLocatie } from '~ozon-model/ontwerpLocatie';
import { OntwerpHoofdlijnen } from '~ozon-model/ontwerpHoofdlijnen';
import { LoadingState } from '~model/loading-state.enum';
import { ActiviteitLocatieaanduidingen } from '~ozon-model/activiteitLocatieaanduidingen';
import { OntwerpActiviteitLocatieaanduidingen } from '~ozon-model/ontwerpActiviteitLocatieaanduidingen';
import { getAnnotationEntityId } from '../helpers/annotaties';

const mockLink = { href: 'https://blaat' };
const mockPage = { size: 1, totalElements: 1, totalPages: 1, number: 1 };

export const activiteitLocatieaanduidingenMock: ActiviteitLocatieaanduidingen = {
  page: mockPage,
  _links: {},
  _embedded: {
    activiteitlocatieaanduidingen: [
      {
        identificatie: 'id',
        activiteitregelkwalificatie: {
          code: 'regel',
          waarde: 'waarde',
        },
        betreftEenActiviteit: {
          identificatie: 'activiteitId',
          naam: 'activiteitNaam',
          geregistreerdMet: {
            beginInwerking: '',
            beginGeldigheid: '',
            tijdstipRegistratie: '',
          },
          groep: {
            code: 'groep',
            waarde: 'groep',
          },
          _links: null,
        },
        _links: null,
      },
    ],
  },
};

export const ontwerpActiviteitLocatieaanduidingenMock: OntwerpActiviteitLocatieaanduidingen = {
  page: mockPage,
  _links: {},
  _embedded: {
    activiteitlocatieaanduidingen: [
      {
        identificatie: 'id',
        activiteitregelkwalificatie: {
          code: 'regel',
          waarde: 'waarde',
        },
        betreftEenActiviteit: {
          identificatie: 'activiteitId',
          naam: 'activiteitNaam',
          groep: {
            code: 'groep',
            waarde: 'groep',
          },
          geregistreerdMet: {
            versie: null,
            tijdstipRegistratie: null,
            eindRegistratie: null,
            status: null,
          },
          _links: null,
        },
        geregistreerdMet: {
          versie: null,
          tijdstipRegistratie: null,
          eindRegistratie: null,
          status: null,
        },
        _links: null,
      },
    ],
  },
};

export const gebiedsaanwijzingenMock = {
  _embedded: {},
  _links: {},
  page: mockPage,
};

export const ontwerpGebiedsaanwijzingenMock = {
  _embedded: {},
  _links: {},
  page: mockPage,
};

export const locatiesMock: Locatie[] = [
  {
    identificatie: 'test-gebied',
    noemer: 'test',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: {
      self: mockLink,
    },
  },
  {
    identificatie: 'gebied-zonder-noemer',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: {
      self: mockLink,
    },
  },
  {
    identificatie: 'gebied-met-lege-noemer',
    noemer: '',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: {
      self: mockLink,
    },
  },
  {
    identificatie: 'gebied-moet-vooraan',
    noemer: 'a-gebied',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: {
      self: mockLink,
    },
  },
];

export const ontwerpLocatiesMock: OntwerpLocatie[] = [
  {
    identificatie: 'ontwerp-test-gebied',
    technischId: '1234',
    noemer: 'test',
    geregistreerdMet: {
      versie: null,
      tijdstipRegistratie: null,
      eindRegistratie: null,
      status: null,
    },
    _links: {
      self: mockLink,
    },
  },
];

export const locatiesResponseMock = {
  _embedded: {
    locaties: locatiesMock,
  },
  _links: {},
  page: mockPage,
};

export const ontwerpLocatiesResponseMock = {
  _embedded: {
    ontwerpLocaties: ontwerpLocatiesMock,
  },
  _links: {},
  page: mockPage,
};

export const locatiesVMMock: LocatieVM[] = [
  {
    identificatie: 'identificatie',
    naam: 'naam',
    symboolcode: undefined,
    isSelected: true,
    isOntwerp: false,
  },
];

export const hoofdlijnenMock: Hoofdlijn[] = [
  {
    identificatie: 'id',
    soort: 'soort',
    naam: 'hoofdlijn',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: {
      self: mockLink,
    },
  },
];

export const hoofdlijnenEntityMock: HoofdlijnenEntity = {
  annotationId: {
    identificatie: 'regeltekstId',
    elementId: 'elementId',
  },
  vastgesteld: {
    _embedded: {
      hoofdlijnen: hoofdlijnenMock,
    },
    _links: {},
    page: mockPage,
  },
};

export const hoofdlijnenResponseMock: Hoofdlijnen = {
  _embedded: {
    hoofdlijnen: [
      {
        identificatie: 'id',
        soort: 'soort',
        naam: 'hoofdlijn',
        geregistreerdMet: {
          beginInwerking: '',
          beginGeldigheid: '',
          tijdstipRegistratie: '',
        },
        _links: {
          self: mockLink,
        },
      },
    ],
  },
  _links: {
    self: mockLink,
  },
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  },
};

export const hoofdlijnenOntwerpResponseMock: OntwerpHoofdlijnen = {
  _embedded: {
    ontwerphoofdlijnen: [
      {
        identificatie: 'id',
        ontwerpbesluitIdentificatie: 'V3',
        technischId: '1234',
        soort: 'soort',
        naam: 'hoofdlijn',
        geregistreerdMet: {
          versie: null,
          tijdstipRegistratie: null,
          eindRegistratie: null,
          status: null,
        },
        _links: {
          self: mockLink,
        },
      },
    ],
  },
  _links: {
    self: mockLink,
  },
  page: {
    size: 0,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  },
};

export const omgevingsnormenEntityMock: EntityPayload<OmgevingsnormenEntity> = {
  entityId: getAnnotationEntityId({
    identificatie: 'regeltekstId',
    elementId: 'elementId',
  }),
  data: {
    annotationId: {
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    },
    vastgesteld: {
      _embedded: {
        omgevingsnormen: [
          {
            groep: { code: 'groepCode', waarde: 'groep' },
            identificatie: 'id',
            naam: 'Testnorm',
            geregistreerdMet: {
              beginInwerking: '',
              beginGeldigheid: '',
              tijdstipRegistratie: '',
            },
            normwaarde: [
              {
                identificatie: 'normwaardeId',
                waardeInRegeltekst: 'waarde op de kaart',
                _links: { self: mockLink, geldtVoor: mockLink },
              },
            ],
            type: { code: 'typeCode', waarde: 'type' },
            _links: { self: mockLink },
          },
        ],
      },
      page: mockPage,
      _links: { self: mockLink },
    },
  },
  status: LoadingState.RESOLVED,
};

export const omgevingswaardenEntityMock: EntityPayload<OmgevingswaardenEntity> = {
  entityId: getAnnotationEntityId({
    identificatie: 'regeltekstId',
    elementId: 'elementId',
  }),
  data: {
    annotationId: {
      identificatie: 'regeltekstId',
      elementId: 'elementId',
    },
    vastgesteld: {
      _embedded: {
        omgevingswaarden: [
          {
            groep: { code: 'groepCode', waarde: 'groep' },
            identificatie: 'id',
            naam: 'Testwaarde',
            geregistreerdMet: {
              beginInwerking: '',
              beginGeldigheid: '',
              tijdstipRegistratie: '',
            },
            normwaarde: [
              {
                identificatie: 'normwaardeId',
                waardeInRegeltekst: 'waarde op de kaart',
                _links: { self: mockLink, geldtVoor: mockLink },
              },
            ],
            type: { code: 'typeCode', waarde: 'type' },
            _links: { self: mockLink },
          },
        ],
      },
      page: mockPage,
      _links: { self: mockLink },
    },
  },
  status: LoadingState.RESOLVED,
};
