import { OmgevingsnormenVM, OmgevingsnormVM } from '~viewer/normen/types/omgevingsnormenVM';
import { NormFactory } from '~mocks/norm-factory';
import { Omgevingswaarden } from '~ozon-model/omgevingswaarden';
import { Omgevingswaarde } from '~ozon-model/omgevingswaarde';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import { OntwerpOmgevingswaarden } from '~ozon-model/ontwerpOmgevingswaarden';
import { OntwerpOmgevingswaarde } from '~ozon-model/ontwerpOmgevingswaarde';

export const omgevingswaardenMock: Omgevingswaarde[] = [
  {
    ...NormFactory.createNorm(),
    groep: {
      code: 'code',
      waarde: 'waarde',
    },
  },
];

export const ontwerpOmgevingswaardenMock: OntwerpOmgevingswaarde[] = [
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

export const mockOmgevingswaardenResponse: Omgevingswaarden = {
  _embedded: {
    omgevingswaarden: omgevingswaardenMock,
  },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export const mockOntwerpOmgevingswaardenResponse: OntwerpOmgevingswaarden = {
  _embedded: {
    ontwerpomgevingswaarden: ontwerpOmgevingswaardenMock,
  },
  page: {
    size: 1,
    totalElements: 0,
    totalPages: 1,
    number: 0,
  },
  _links: { self: { href: 'href' } },
};

export class OmgevingswaardenVMFactory {
  public static createOmgevingswaardenVM(normType: NormType, data: Partial<OmgevingsnormVM> = {}): OmgevingsnormenVM {
    return {
      identificatie: 'code',
      naam: 'waarde',
      normen: [
        {
          identificatie: 'normId',
          naam: 'naam',
          eenheid: data.eenheid || '',
          normType,
          normwaarden: [
            {
              identificatie: `normwaardeId`,
              naam: 'veel waarde',
              representationLabel: 'veel waarde',
              isOntwerp: false,
              isSelected: false,
              symboolcode: undefined,
            },
          ],
          type: 'waarde',
        },
      ],
    };
  }
}
