import * as fromSelectors from './divisieannotatie.selectors';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { DivisieannotatieEntity } from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.reducer';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';

const divisieId = 'testdivisieId';
const testId = 'testId';

const divisieannotatie: Divisieannotatie = {
  documentIdentificatie: '/akn/nl/act/mnre1034/2019/reg0001',
  documentKruimelpad: [],
  identificatie: divisieId,
  juridischeGrondslagIdentificatie: [
    '/akn/nl/act/mnre1034/2019/reg0001/mnre1034_1-0__chp_2__subchp_2.2__subsec_2.2.2__art_2.4',
  ],
  geregistreerdMet: {
    beginInwerking: '',
    beginGeldigheid: '',
    tijdstipRegistratie: '',
  },
  _links: {
    omschrijving: { href: '' },
    self: { href: 'url' },
    heeftWerkingIn: { href: 'url' },
    bevat: { href: 'url' },
    beschrijftGebiedsaanwijzingen: { href: 'url' },
    isVrijetekstannotatieBij: { href: 'url' },
  },
};

describe('divisieannotatieSelectors', () => {
  describe('selectAnnotation', () => {
    it('should return empty object without a match', () => {
      expect(fromSelectors.selectAnnotation('/akn/nl/act/mnre1034/2019/reg0001', testId).projector([])).toEqual(
        undefined
      );
    });

    it('should compile vastgesteld AnnotationVM from vastgesteld', () => {
      const input: DivisieannotatieEntity = {
        id: divisieId,
        elementId: testId,
        documentIdentificatie: divisieannotatie.documentIdentificatie,
        vastgesteld: divisieannotatie,
      };

      const output: AnnotationVM = {
        annotationId: {
          elementId: testId,
          identificatie: divisieId,
          technischId: undefined,
        },
        vastgesteld: {
          locatiesHref: 'url',
          gebiedsaanwijzingenHref: 'url',
          hoofdlijnenHref: 'url',
          kaartenHref: undefined,
        },
        ontwerp: undefined,
        themas: undefined,
      };

      expect(fromSelectors.selectAnnotation(divisieannotatie.documentIdentificatie, testId).projector([input])).toEqual(
        output
      );
    });
  });

  describe('selectDivisieByElementId', () => {
    it('should return divisie', () => {
      const input: DivisieannotatieEntity = {
        id: divisieId,
        elementId: testId,
        documentIdentificatie: divisieannotatie.documentIdentificatie,
        vastgesteld: divisieannotatie,
      };

      expect(
        fromSelectors
          .selectDivisieannotatieByDocumentIdAndElementId(divisieannotatie.documentIdentificatie, testId)
          .projector([input])
      ).toEqual(input);
    });
  });
});
