import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { NormFactory } from '~mocks/norm-factory';
import { Omgevingsnormen } from '~ozon-model/omgevingsnormen';
import { Omgevingsnorm } from '~ozon-model/omgevingsnorm';
import { OntwerpOmgevingsnormen } from '~ozon-model/ontwerpOmgevingsnormen';
import { OntwerpOmgevingsnorm } from '~ozon-model/ontwerpOmgevingsnorm';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';

export const omgevingsnormenWithEenheidMock: Omgevingsnorm[] = [
  {
    ...NormFactory.createNorm(true),
    groep: {
      code: 'code',
      waarde: 'waarde',
    },
  },
];

export const omgevingsnormenMock: Omgevingsnorm[] = [
  {
    ...NormFactory.createNorm(),
    groep: {
      code: 'code',
      waarde: 'waarde',
    },
  },
];

export const ontwerpOmgevingsnormenMock: OntwerpOmgevingsnorm[] = [
  {
    ...NormFactory.createOntwerpNorm(),
    technischId: '1234',
    ontwerpbesluitIdentificatie: 'V2',
    groep: {
      code: 'code',
      waarde: 'waarde',
    },
  },
];

export const mockOmgevingsnormenResponse: Omgevingsnormen = {
  _embedded: {
    omgevingsnormen: omgevingsnormenMock,
  },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export const mockOntwerpOmgevingsnormenResponse: OntwerpOmgevingsnormen = {
  _embedded: {
    ontwerpomgevingsnormen: ontwerpOmgevingsnormenMock,
  },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export const mockOmgevingsnormenResponseWithNextHref: Omgevingsnormen = {
  _embedded: {
    omgevingsnormen: omgevingsnormenMock,
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

export const omgevingsnormenVM: OmgevingsnormenVM = {
  identificatie: 'code',
  naam: 'waarde',
  normen: [
    {
      identificatie: 'normId',
      naam: 'naam',
      eenheid: '',
      normType: NormType.OMGEVINGSNORMEN,
      normwaarden: [
        {
          identificatie: 'normwaardeId',
          representationLabel: 'veel waarde',
          naam: 'veel waarde',
          isOntwerp: false,
          isSelected: false,
          symboolcode: undefined,
        },
      ],
      type: 'waarde',
    },
  ],
};
