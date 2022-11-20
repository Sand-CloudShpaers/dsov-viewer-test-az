import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { NormFactory } from '~mocks/norm-factory';
import { Omgevingsnormen } from '~ozon-model/omgevingsnormen';
import { Omgevingsnorm } from '~ozon-model/omgevingsnorm';
import { OntwerpOmgevingsnorm } from '~ozon-model/ontwerpOmgevingsnorm';
import { FilterName, FilterOptions } from '../types/filter-options';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';

export const mockFilterOptions: FilterOptions = {
  [FilterName.LOCATIE]: [],
  [FilterName.ACTIVITEIT]: [],
  [FilterName.GEBIEDEN]: [],
  [FilterName.DOCUMENTEN]: [],
  [FilterName.THEMA]: [],
  [FilterName.DOCUMENT_TYPE]: [],
  [FilterName.REGELGEVING_TYPE]: [],
  [FilterName.REGELSBELEID]: [],
  [FilterName.DATUM]: [],
};

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

export const omgevingsnormenVM: OmgevingsnormenVM = {
  identificatie: 'code',
  naam: 'waarde',
  normen: [
    {
      identificatie: 'normId',
      naam: 'naam',
      eenheid: '',
      normType: NormType.OMGEVINGSWAARDEN,
      normwaarden: [
        {
          identificatie: 'omgevingsnormen/normId/normwaarden/normwaardeId',
          representationLabel: 'veel waarde',
          naam: 'veel waarde',
          isOntwerp: false,
          isSelected: true,
        },
      ],
      type: 'waarde',
    },
  ],
};
