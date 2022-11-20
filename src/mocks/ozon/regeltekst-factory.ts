import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { Regeltekst } from '~ozon-model/regeltekst';

export const mockRegelTekst = (data: Partial<Regeltekst> = {}): Regeltekst => ({
  identificatie: data.identificatie || 'geit123',
  thema: [{ code: '', waarde: '' }],
  documentIdentificatie: 'geit123',
  geregistreerdMet: {
    beginInwerking: '',
    beginGeldigheid: '',
    tijdstipRegistratie: '',
  },
  documentKruimelpad: [
    {
      nummer: '',
      opschrift: '',
      identificatie: '',
    },
  ],
  _links: {
    self: { href: '' },
    isRegelstructuurannotatieBij: { href: '' },
    beschrijftActiviteiten: { href: '' },
    beschrijftOmgevingsnormen: { href: '' },
    beschrijftOmgevingswaarden: { href: '' },
    bevatKaarten: { href: '' },
    heeftWerkingIn: { href: '' },
  },
});

export const mockOntwerpRegelTekst = (data: Partial<OntwerpRegeltekst> = {}): OntwerpRegeltekst => ({
  identificatie: data.identificatie || 'geit345',
  technischId: 'geit345_technisch_id',
  thema: [{ code: '', waarde: '' }],
  documentTechnischId: 'geit345',
  omschrijving: '',
  isRegelstructuurannotatieBij: null,
  documentKruimelpad: [
    {
      nummer: '',
      opschrift: '',
      identificatie: '',
    },
  ],
  geregistreerdMet: {
    versie: null,
    tijdstipRegistratie: null,
    eindRegistratie: null,
    status: null,
  },
  _links: {
    self: { href: '' },
    isRegelstructuurannotatieBij: { href: '' },
    beschrijftActiviteiten: { href: '' },
    beschrijftOmgevingsnormen: { href: '' },
    beschrijftOmgevingswaarden: { href: '' },
    bevatKaarten: { href: '' },
    heeftWerkingIn: { href: '' },
  },
});
