import { Gebiedsaanwijzingen } from '~ozon-model/gebiedsaanwijzingen';
import { GebiedsaanwijzingenVM, GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { GebiedsaanwijzingenEntity } from '~viewer/annotaties/types/entity';
import { Gebiedsaanwijzing } from '~ozon-model/gebiedsaanwijzing';

export const mockbeperkingsgebieden: Gebiedsaanwijzing[] = [
  {
    identificatie: 'identificatie',
    naam: 'naam',
    label: 'Beperkingengebieden',
    gebiedsaanwijzingType: 'type',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: {
      self: { href: 'href' },
      beschrevenIn: { href: 'href' },
      wijstAan: { href: 'href' },
    },
    groep: {
      code: 'code',
      waarde: 'groep',
    },
  },
];

export const mockGebiedsaanwijzingenResponse: Gebiedsaanwijzingen = {
  _embedded: {
    gebiedsaanwijzingen: mockbeperkingsgebieden,
  },
  _links: { self: { href: 'href' } },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 1,
    number: 0,
  },
};

export const mockGebiedsaanwijzingenEntity: GebiedsaanwijzingenEntity = {
  annotationId: {
    identificatie: 'regeltekstId',
    elementId: 'elementId',
  },
  vastgesteld: mockGebiedsaanwijzingenResponse,
  ontwerp: undefined,
};

export const mockGebiedsaanwijzingenResponseWithNextHref: Gebiedsaanwijzingen = {
  _embedded: {
    gebiedsaanwijzingen: mockbeperkingsgebieden,
  },
  _links: {
    self: { href: 'href' },
    next: {
      href: 'https://next-plea.se',
    },
  },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 2,
    number: 0,
  },
};

const mockGebiedsaanwijzingVM: GebiedsaanwijzingVM = {
  identificatie: 'identificatie',
  naam: 'naam',
  groep: 'groep',
  isOntwerp: false,
  isSelected: false,
  symboolcode: undefined,
};

export const mockGebiedsaanwijzingenVM: GebiedsaanwijzingenVM = {
  gebiedsaanwijzingType: 'type',
  label: 'Beperkingengebieden',
  gebiedsaanwijzingen: [mockGebiedsaanwijzingVM],
};
