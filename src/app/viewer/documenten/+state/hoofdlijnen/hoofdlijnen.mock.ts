import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { Hoofdlijn } from '~ozon-model/hoofdlijn';
import { OntwerpHoofdlijnen } from '~ozon-model/ontwerpHoofdlijnen';
import { OntwerpHoofdlijn } from '~ozon-model/ontwerpHoofdlijn';

export const mockHoofdlijnen: Hoofdlijn[] = [
  {
    identificatie: 'nl.imow-gm0983.hoofdlijn.VRKOVhfst1',
    naam: 'hfst 1',
    soort: 'Doelstelling',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: { self: { href: 'testUrl/nl.imow-gm0983.hoofdlijn.VRKOVhfst1' } },
  },
];

export const mockOntwerpHoofdlijnen: OntwerpHoofdlijn[] = [
  {
    identificatie: 'nl.imow-gm0983.hoofdlijn.VRKOVhfst1',
    naam: 'hfst 1',
    soort: 'Doelstelling',
    ontwerpbesluitIdentificatie: '',
    technischId: '',
    geregistreerdMet: {
      versie: null,
      tijdstipRegistratie: null,
      eindRegistratie: null,
      status: null,
    },
    _links: { self: { href: 'testUrl/nl.imow-gm0983.hoofdlijn.VRKOVhfst1' } },
  },
];

export const mockHoofdlijnenResponse: Hoofdlijnen = {
  _embedded: {
    hoofdlijnen: mockHoofdlijnen,
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export const mockOntwerpHoofdlijnenResponse: OntwerpHoofdlijnen = {
  _embedded: {
    ontwerphoofdlijnen: mockOntwerpHoofdlijnen,
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};
