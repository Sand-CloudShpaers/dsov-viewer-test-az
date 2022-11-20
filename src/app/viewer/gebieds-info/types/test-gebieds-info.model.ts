import { Activiteit } from '~ozon-model/activiteit';

export const TEST_IDENTIFICATIE = 'testIdentificatie';

export const mockActiviteitFactory = (): Activiteit => ({
  identificatie: TEST_IDENTIFICATIE,
  naam: '',
  groep: { code: '', waarde: '' },
  geregistreerdMet: {
    beginInwerking: '',
    beginGeldigheid: '',
    tijdstipRegistratie: '',
  },
  _links: {
    self: {
      href: '',
    },
    beschrevenIn: {
      href: '',
    },
    is: {
      href: '',
    },
    isGereguleerdVoor: {
      href: '',
    },
    gerelateerd: {
      href: '',
    },
  },
});
