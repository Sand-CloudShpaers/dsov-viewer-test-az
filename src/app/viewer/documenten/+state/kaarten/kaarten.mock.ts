import { Kaarten } from '~ozon-model/kaarten';
import { Kaart } from '~ozon-model/kaart';
import { KaartVM } from '~viewer/annotaties/types/kaartenVM';
import { OntwerpKaarten } from '~ozon-model/ontwerpKaarten';
import { OntwerpKaart } from '~ozon-model/ontwerpKaart';

export const kaartenMock: Kaart[] = [
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000001',
    naam: 'Welstandskaart',
    nummer: '001',
    uitsnede: {
      minX: 134216.0,
      minY: 421753.0,
      maxX: 140251.0,
      maxY: 426020.0,
    },
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    bevat: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000001',
        naam: 'welstandslaag',
        niveau: 1,
        _links: {
          self: {
            href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
          },
        },
      },
    ],
    _links: {
      self: {
        href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
      },
    },
  },
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000002',
    naam: 'Welstandskaart',
    nummer: '002',
    uitsnede: {
      minX: 134216.0,
      minY: 421753.0,
      maxX: 140251.0,
      maxY: 426020.0,
    },
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    bevat: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000002',
        naam: 'welstandslaag',
        niveau: 1,
        _links: {
          self: {
            href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
          },
        },
      },
    ],
    _links: {
      self: {
        href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
      },
    },
  },
];

export const ontwerpKaartenMock: OntwerpKaart[] = [
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000001',
    naam: 'Welstandskaart',
    nummer: '001',
    ontwerpbesluitIdentificatie: 'abc',
    technischId: 'nl.imow-gm0297.kaart.2019000001-abc',
    uitsnede: {
      minX: 134216.0,
      minY: 421753.0,
      maxX: 140251.0,
      maxY: 426020.0,
    },
    bevat: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000001',
        naam: 'welstandslaag',
        niveau: 1,
        _links: {
          self: {
            href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
          },
        },
      },
    ],
    geregistreerdMet: {
      versie: null,
      tijdstipRegistratie: null,
      eindRegistratie: null,
      status: null,
    },
    _links: {
      self: {
        href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
      },
    },
  },
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000002',
    naam: 'Welstandskaart',
    nummer: '002',
    ontwerpbesluitIdentificatie: 'abc',
    technischId: 'nl.imow-gm0297.kaart.2019000002-abc',
    uitsnede: {
      minX: 134216.0,
      minY: 421753.0,
      maxX: 140251.0,
      maxY: 426020.0,
    },
    bevat: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000002',
        naam: 'welstandslaag',
        niveau: 1,
        _links: {
          self: {
            href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
          },
        },
      },
    ],
    geregistreerdMet: {
      versie: null,
      tijdstipRegistratie: null,
      eindRegistratie: null,
      status: null,
    },
    _links: {
      self: {
        href: 'https://service.int.omgevingswet.overheid.nl/publiek/omgevingsdocumenten/api/presenteren/v5/kaarten/nl.imow-gm0297.kaart.2019000001',
      },
    },
  },
];

export const mockKaartenResponse: Kaarten = {
  _embedded: {
    kaarten: kaartenMock,
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export const mockOntwerpKaartenResponse: OntwerpKaarten = {
  _embedded: {
    ontwerpkaarten: ontwerpKaartenMock,
  },
  page: {
    size: 1,
    totalElements: 1,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export const mockKaartenResponseWithNextHref: Kaarten = {
  _embedded: {
    kaarten: kaartenMock,
  },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 2,
    number: 0,
  },
  _links: {
    self: { href: 'href' },
    next: { href: 'https://next-plea.se' },
  },
};

export const kaartVMMocks: KaartVM[] = [
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000001',
    naam: 'Welstandskaart',
    nummer: '001',
    isOntwerp: false,
    kaartlagen: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000001',
        naam: 'welstandslaag',
        niveau: 1,
        symboolcode: undefined,
        isSelected: false,
      },
    ],
  },
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000002',
    naam: 'Welstandskaart',
    nummer: '002',
    isOntwerp: false,
    kaartlagen: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000002',
        naam: 'welstandslaag',
        niveau: 1,
        symboolcode: undefined,
        isSelected: false,
      },
    ],
  },
];

export const kaartVMMocks02: KaartVM[] = [
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000001',
    naam: 'Welstandskaart',
    nummer: '001',
    isOntwerp: false,
    kaartlagen: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000001',
        naam: 'welstandslaag',
        niveau: 1,
        symboolcode: undefined,
        isSelected: false,
      },
    ],
  },
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000002',
    naam: 'Welstandskaart',
    nummer: '002',
    isOntwerp: false,
    kaartlagen: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000002',
        naam: 'welstandslaag',
        niveau: 1,
        symboolcode: undefined,
        isSelected: false,
      },
    ],
  },
  {
    identificatie: 'nl.imow-gm0297.kaart.2019000008',
    naam: 'Welstandskaart',
    nummer: '002',
    isOntwerp: false,
    kaartlagen: [
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000007',
        naam: 'welstandslaag',
        niveau: 2,
        symboolcode: undefined,
        isSelected: false,
      },
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000008',
        naam: 'welstandslaag',
        niveau: 3,
        symboolcode: undefined,
        isSelected: false,
      },
      {
        identificatie: 'nl.imow-gm0297.kaartlaag.2019000009',
        naam: 'welstandslaag',
        niveau: 1,
        symboolcode: undefined,
        isSelected: false,
      },
    ],
  },
];
