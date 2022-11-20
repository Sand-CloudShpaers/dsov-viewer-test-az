import { ActiviteitLocatieaanduidingVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { ActiviteitLocatieaanduiding } from '~ozon-model/activiteitLocatieaanduiding';
import { ActiviteitLocatieaanduidingen } from '~ozon-model/activiteitLocatieaanduidingen';
import { mockActiviteiten } from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import { ActiviteitLocatieaanduidingenEntity } from '~viewer/annotaties/types/entity';

export const mockActiviteitLocatieaanduidingen: ActiviteitLocatieaanduiding[] = [
  {
    identificatie: '1234',
    activiteitregelkwalificatie: {
      code: 'code',
      waarde: 'waarde',
    },
    betreftEenActiviteit: mockActiviteiten[0],
    _links: {
      self: { href: 'https://efteling.nl' },
      kwalificeert: { href: 'https://iedereen/is/welkom' },
    },
  },
];
export const mock2ActiviteitLocatieaanduidingen: ActiviteitLocatieaanduiding[] = [
  {
    identificatie: '5678',
    activiteitregelkwalificatie: {
      code: 'code',
      waarde: 'waarde',
    },
    betreftEenActiviteit: mockActiviteiten[0],
    _links: {
      self: { href: 'https://walibi.nl' },
      kwalificeert: { href: 'https://het/is/stom' },
    },
  },
];

export const mockActiviteitLocatieaanduidingenResponse: ActiviteitLocatieaanduidingen = {
  _embedded: {
    activiteitlocatieaanduidingen: mockActiviteitLocatieaanduidingen,
  },
  _links: {
    self: {
      href: 'https://activiteitLocatieaanduidingen',
    },
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 0,
  },
};

export const mockActiviteitLocatieaanduidingenEntity: ActiviteitLocatieaanduidingenEntity = {
  annotationId: {
    identificatie: 'regeltekstId',
    elementId: 'elementId',
  },
  vastgesteld: mockActiviteitLocatieaanduidingenResponse,
};

export const mockActiviteitLocatieaanduidingenVM: ActiviteitLocatieaanduidingVM = {
  identificatie: '1234/activiteitlocatieaanduidingen/1234',
  naam: 'Dagje naar de Efteling',
  regelkwalificatie: 'waarde',
  kwalificeertHref: 'https://iedereen/is/welkom',
  isOntwerp: false,
  isSelected: true,
};
