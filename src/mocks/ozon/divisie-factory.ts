import { Divisieannotatie } from '~ozon-model/divisieannotatie';

export const mockDivisie = (data: Partial<Divisieannotatie> = {}): Divisieannotatie => ({
  documentIdentificatie: 'blub123',
  documentKruimelpad: [{}],
  identificatie: data.identificatie || 'blub123',
  juridischeGrondslagIdentificatie: ['blub123'],
  themas: [
    {
      code: '',
      waarde: '',
    },
  ],
  geregistreerdMet: {
    beginInwerking: '',
    beginGeldigheid: '',
    tijdstipRegistratie: '',
  },
  _links: {
    omschrijving: { href: '' },
    isVrijetekstannotatieBij: { href: '' },
    self: { href: '' },
    bevat: { href: '' },
    benoemtKaarten: { href: '' },
    beschrijftGebiedsaanwijzingen: { href: '' },
    heeftWerkingIn: { href: '' },
  },
});
