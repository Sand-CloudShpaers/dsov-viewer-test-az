import * as fromSelectors from './regeltekst.selectors';
import { Regeltekst } from '~ozon-model/regeltekst';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { RegeltekstEntity } from './regeltekst.reducer';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { regelgevingtypeFilterMocks } from '~mocks/regelgevingtypes';

const regeltekstId = 'testRegeltekstId';
const technischId = 'technischId';
const testId = 'testId';

const vastgesteld: Regeltekst = {
  documentIdentificatie: '/akn/nl/act/mnre1034/2019/reg0001',
  documentKruimelpad: [],
  identificatie: regeltekstId,
  juridischeGrondslagIdentificatie: [
    '/akn/nl/act/mnre1034/2019/reg0001/mnre1034_1-0__chp_2__subchp_2.2__subsec_2.2.2__art_2.4',
  ],
  typeJuridischeRegels: Regeltekst.TypeJuridischeRegelsEnum.Instructieregel,
  instructieregelInstrument: [{ code: 'http', waarde: 'besluitGeldelijkeRegelingen' }],
  thema: [{ code: '1', waarde: 'thema' }],
  geregistreerdMet: {
    beginInwerking: '',
    beginGeldigheid: '',
    tijdstipRegistratie: '',
  },
  _links: {
    self: { href: 'url' },
    heeftWerkingIn: { href: 'url' },
    beschrijftActiviteiten: { href: 'url' },
    isRegelstructuurannotatieBij: { href: 'url' },
    beschrijftOmgevingsnormen: { href: 'url' },
    beschrijftOmgevingswaarden: { href: 'url' },
    beschrijftGebiedsaanwijzingen: { href: 'url' },
    bevatKaarten: { href: 'url' },
    heeftWerkingInIndicatief: { href: 'url' },
    heeftWerkingInExact: { href: 'url' },
  },
};

const ontwerp: OntwerpRegeltekst = {
  documentTechnischId: '/akn/nl/act/mnre1034/2019/reg0001',
  documentKruimelpad: [],
  identificatie: regeltekstId,
  technischId,
  juridischeGrondslagIdentificatie: [
    '/akn/nl/act/mnre1034/2019/reg0001/mnre1034_1-0__chp_2__subchp_2.2__subsec_2.2.2__art_2.4',
  ],
  typeJuridischeRegels: null,
  thema: [{ code: '1', waarde: 'thema' }],
  omschrijving: '',
  isRegelstructuurannotatieBij: null,
  geregistreerdMet: {
    versie: null,
    tijdstipRegistratie: null,
    eindRegistratie: null,
    status: null,
  },
  _links: {
    self: { href: 'url' },
    heeftWerkingIn: { href: 'url' },
    beschrijftActiviteiten: { href: 'url' },
    isRegelstructuurannotatieBij: { href: 'url' },
    beschrijftOmgevingsnormen: { href: 'url' },
    beschrijftOmgevingswaarden: { href: 'url' },
    beschrijftGebiedsaanwijzingen: { href: 'url' },
    bevatKaarten: { href: 'url' },
  },
};

const ontwerp2: OntwerpRegeltekst = {
  documentTechnischId: '/akn/nl/act/mnre1034/2019/reg0001',
  documentKruimelpad: [],
  identificatie: regeltekstId,
  technischId,
  juridischeGrondslagIdentificatie: [
    '/akn/nl/act/mnre1034/2019/reg0001/mnre1034_1-0__chp_2__subchp_2.2__subsec_2.2.2__art_2.4',
  ],
  typeJuridischeRegels: null,
  thema: [{ code: '1', waarde: 'thema' }],
  isRegelstructuurannotatieBij: null,
  omschrijving: '',
  geregistreerdMet: {
    versie: null,
    tijdstipRegistratie: null,
    eindRegistratie: null,
    status: null,
  },
  _links: {
    self: { href: 'url' },
    heeftWerkingIn: null,
    heeftWerkingInVastgesteld: { href: 'url' },
    beschrijftActiviteitenVastgesteld: { href: 'url' },
    isRegelstructuurannotatieBij: { href: 'url' },
    beschrijftOmgevingsnormenVastgesteld: { href: 'url' },
    beschrijftOmgevingswaardenVastgesteld: { href: 'url' },
    beschrijftGebiedsaanwijzingenVastgesteld: { href: 'url' },
    bevatKaartenVastgesteld: { href: 'url' },
  },
};

describe('RegeltekstSelectors', () => {
  describe('selectAnnotation', () => {
    it('should return empty object without a match', () => {
      expect(fromSelectors.selectAnnotation('documentId', testId, []).projector([])).toEqual(undefined);
    });

    it('should compile vastgesteld AnnotationVM from vastgesteld', () => {
      const input: RegeltekstEntity = {
        id: regeltekstId,
        elementId: testId,
        documentIdentificatie: vastgesteld.documentIdentificatie,
        vastgesteld,
        ontwerp: undefined,
      };
      const output: AnnotationVM = {
        annotationId: {
          elementId: testId,
          identificatie: regeltekstId,
          technischId: undefined,
        },
        typeRegelgeving: 'instructieregel voor besluit geldelijke regelingen',
        themas: [{ identificatie: '1', naam: 'thema' }],
        vastgesteld: {
          locatiesHref: 'url',
          activiteitenHref: 'url',
          omgevingswaardenHref: 'url',
          omgevingsnormenHref: 'url',
          gebiedsaanwijzingenHref: 'url',
          kaartenHref: 'url',
          idealisatieHref: 'url',
        },
        ontwerp: undefined,
      };

      expect(
        fromSelectors
          .selectAnnotation(vastgesteld.documentIdentificatie, testId, regelgevingtypeFilterMocks)
          .projector([input])
      ).toEqual(output);
    });

    it('should compile vastgesteld AnnotationVM from vastgesteld, with no typeregelgeving suffix', () => {
      const input: RegeltekstEntity = {
        id: regeltekstId,
        elementId: testId,
        documentIdentificatie: vastgesteld.documentIdentificatie,
        vastgesteld: {
          ...vastgesteld,
          instructieregelInstrument: [{ code: '', waarde: 'bla bla' }],
        },
        ontwerp: undefined,
      };
      const output: AnnotationVM = {
        annotationId: {
          elementId: testId,
          identificatie: regeltekstId,
          technischId: undefined,
        },
        typeRegelgeving: 'instructieregel',
        themas: [{ identificatie: '1', naam: 'thema' }],
        vastgesteld: {
          locatiesHref: 'url',
          activiteitenHref: 'url',
          omgevingswaardenHref: 'url',
          omgevingsnormenHref: 'url',
          gebiedsaanwijzingenHref: 'url',
          kaartenHref: 'url',
          idealisatieHref: 'url',
        },
        ontwerp: undefined,
      };

      expect(
        fromSelectors
          .selectAnnotation(vastgesteld.documentIdentificatie, testId, regelgevingtypeFilterMocks)
          .projector([input])
      ).toEqual(output);
    });

    it('should compile ontwerp AnnotationVM from ontwerp', () => {
      const input: RegeltekstEntity = {
        id: regeltekstId,
        elementId: testId,
        documentIdentificatie: vastgesteld.documentIdentificatie,
        vastgesteld: undefined,
        ontwerp,
      };
      const output: AnnotationVM = {
        annotationId: {
          elementId: testId,
          identificatie: regeltekstId,
          technischId,
        },
        typeRegelgeving: undefined,
        themas: [{ identificatie: '1', naam: 'thema' }],
        vastgesteld: {
          locatiesHref: undefined,
          activiteitenHref: undefined,
          omgevingswaardenHref: undefined,
          omgevingsnormenHref: undefined,
          gebiedsaanwijzingenHref: undefined,
          kaartenHref: undefined,
          idealisatieHref: undefined,
        },
        ontwerp: {
          locatiesHref: 'url',
          activiteitenHref: 'url',
          omgevingswaardenHref: 'url',
          omgevingsnormenHref: 'url',
          gebiedsaanwijzingenHref: 'url',
          kaartenHref: 'url',
        },
      };

      expect(fromSelectors.selectAnnotation(vastgesteld.documentIdentificatie, testId, []).projector([input])).toEqual(
        output
      );
    });

    it('should compile vastgesteld AnnotationVM from ontwerp', () => {
      const input: RegeltekstEntity = {
        id: regeltekstId,
        elementId: testId,
        documentIdentificatie: vastgesteld.documentIdentificatie,
        vastgesteld: undefined,
        ontwerp: ontwerp2,
      };
      const output: AnnotationVM = {
        annotationId: {
          elementId: testId,
          identificatie: regeltekstId,
          technischId,
        },
        typeRegelgeving: undefined,
        themas: [{ identificatie: '1', naam: 'thema' }],
        vastgesteld: {
          locatiesHref: 'url',
          activiteitenHref: 'url',
          omgevingswaardenHref: 'url',
          omgevingsnormenHref: 'url',
          gebiedsaanwijzingenHref: 'url',
          kaartenHref: 'url',
          idealisatieHref: undefined,
        },
        ontwerp: {
          locatiesHref: undefined,
          activiteitenHref: undefined,
          omgevingswaardenHref: undefined,
          omgevingsnormenHref: undefined,
          gebiedsaanwijzingenHref: undefined,
          kaartenHref: undefined,
        },
      };

      expect(fromSelectors.selectAnnotation(vastgesteld.documentIdentificatie, testId, []).projector([input])).toEqual(
        output
      );
    });
  });

  describe('selectRegeltekstByElementId', () => {
    it('should return regeltekst', () => {
      const input: RegeltekstEntity = {
        id: regeltekstId,
        elementId: testId,
        documentIdentificatie: vastgesteld.documentIdentificatie,
        vastgesteld,
        ontwerp: undefined,
      };

      expect(
        fromSelectors
          .selectRegeltekstByDocumentIdAndElementId(vastgesteld.documentIdentificatie, testId)
          .projector([input])
      ).toEqual(input);
    });
  });
});
