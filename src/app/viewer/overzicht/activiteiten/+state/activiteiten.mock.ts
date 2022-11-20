import { Activiteit } from '~ozon-model/activiteit';
import {
  AanduidingLocaties,
  AanduidingLocatiesVM,
  ActiviteitenGroepVM,
  ActiviteitLocatieaanduidingenGroepVM,
  ActiviteitLocatieaanduidingVM,
  ActiviteitVM,
} from '~viewer/gebieds-info/types/gebieds-info.model';
import { Activiteiten } from '~ozon-model/activiteiten';

const mockActiviteit: Activiteit = {
  identificatie: '1234',
  naam: 'Dagje naar de Efteling',
  geregistreerdMet: {
    beginInwerking: '',
    beginGeldigheid: '',
    tijdstipRegistratie: '',
  },
  groep: {
    code: 'Dagjeweg.nl',
    waarde: 'Dagje uit',
  },
  _links: {
    self: {
      href: 'https://efteling.nl',
    },
    isGereguleerdVoor: {
      href: 'https://iedereen/is/welkom',
    },
    gerelateerd: {
      href: 'https://hebeenrelatie.met/ik',
    },
    is: {
      href: '',
    },
  },
};

export const mockActiviteiten: Activiteit[] = [
  mockActiviteit,
  {
    identificatie: '5678',
    naam: 'Dagje naar de Walibi',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    groep: {
      code: 'Dagjeweg.nl',
      waarde: 'Dagje uit',
    },
    _links: {
      self: {
        href: 'https://walibi.nl',
      },
      isGereguleerdVoor: {
        href: 'https://iedereen/is/welkom',
      },
      gerelateerd: {
        href: 'https://hebeenrelatie.met/ik',
      },
      is: {
        href: '',
      },
    },
  },
];

export const mockActiviteitenResponse: Activiteiten = {
  _embedded: {
    activiteiten: mockActiviteiten,
  },
  _links: {
    self: {
      href: 'https://activiteiten',
    },
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 2,
    number: 1,
  },
};

export const mockActiviteitenResponseWithNextHref: Activiteiten = {
  _embedded: {
    activiteiten: mockActiviteiten,
  },
  _links: {
    self: {
      href: 'https://activiteiten',
    },
    next: {
      href: 'https://next-plea.se',
    },
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 2,
    number: 0,
  },
};

export const mockActiviteitenVM: ActiviteitVM[] = [
  {
    identificatie: '1234',
    naam: 'Dagje naar de Efteling',
  },
  {
    identificatie: '5678',
    naam: 'Dagje naar de Walibi',
  },
];

export const mockActiviteitenGroepVM: ActiviteitenGroepVM = {
  code: 'Dagjeweg.nl',
  waarde: 'Dagje uit',
  activiteiten: mockActiviteitenVM,
};

const activiteitLocatieaanduidingVM: ActiviteitLocatieaanduidingVM = {
  identificatie: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
  naam: 'naam',
  regelkwalificatie: 'regelkwalificatie',
  isOntwerp: false,
  kwalificeertHref: 'link',
  isSelected: true,
};

export const activiteitLocatieaanduidingenGroepVM: ActiviteitLocatieaanduidingenGroepVM = {
  code: 'code',
  waarde: 'waarde',
  activiteitLocatieaanduidingen: [activiteitLocatieaanduidingVM],
};

export const mockAanduidingLocaties: AanduidingLocaties = {
  id: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
  locaties: [
    {
      identificatie: 'gebied1',
      noemer: 'Gebied 1',
      geregistreerdMet: {
        beginInwerking: '',
        beginGeldigheid: '',
        tijdstipRegistratie: '',
      },
    },
    {
      identificatie: 'gebied2',
      noemer: 'Gebied 2',
      geregistreerdMet: {
        beginInwerking: '',
        beginGeldigheid: '',
        tijdstipRegistratie: '',
      },
    },
  ],
};

export const mockAanduidingLocatiesVM: AanduidingLocatiesVM = {
  id: 'activiteitId/activiteitlocatieaanduidingen/activiteitLocatieaanduidingId',
  locaties: [
    {
      identificatie: 'gebied1',
      naam: 'Gebied 1',
      isOntwerp: false,
    },
    {
      identificatie: 'gebied2',
      naam: 'Gebied 1',
      isOntwerp: false,
    },
  ],
};
