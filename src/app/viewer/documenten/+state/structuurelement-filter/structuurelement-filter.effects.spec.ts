import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { StructuurElementFilterEffects } from './structuurelement-filter.effects';
import * as StructuurelementFilterActions from './structuurelement-filter.actions';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { DocumentType } from '~viewer/documenten/types/document-types';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { Regelteksten } from '~ozon-model/regelteksten';
import initialState from '~mocks/initial-state';
import { createRegelingMock } from '~mocks/documenten.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { Regeltekst } from '~ozon-model/regeltekst';
import { Divisieannotaties } from '~ozon-model/divisieannotaties';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import * as fromDocumentLocatie from '~viewer/documenten/+state/document-locatie/document-locatie.reducer';

describe('StructuurElementFilterEffects', () => {
  let spectator: SpectatorService<StructuurElementFilterEffects>;
  let actions$: Observable<Action>;
  let omgevingsDocumentService: SpyObject<OmgevingsDocumentService>;
  const documentArtikelStructuur: DocumentDto = {
    documentId: '/akn/nl/act/testArtikelStructuurDocumentId',
    documentType: DocumentType.omgevingsverordening,
  };
  const documentVrijeTekstStructuurDivisie: DocumentDto = {
    documentId: '/akn/nl/act/testVrijeTekstStructuurDivisieDocumentId',
    documentType: DocumentType.omgevingsVisie,
  };
  const ozonArtikelStructuurDocumentMock = createRegelingMock({
    identificatie: '/akn/nl/act/testArtikelStructuurDocumentId',
    type: { code: 'omgevingsverordening', waarde: 'omgevingsverordening' },
  });
  const ozonVrijeTekstStructuurDivisieDocumentMock = createRegelingMock({
    identificatie: '/akn/nl/act/testVrijeTekstStructuurDivisieDocumentId',
    type: { code: 'omgevingsvisie', waarde: 'omgevingsvisie' },
  });
  const ozonVrijeTekstStructuurDivisietekstDocumentMock = createRegelingMock({
    identificatie: '/akn/nl/act/testVrijeTekstStructuurDivisietekstDocumentId',
    type: { code: 'omgevingsvisie', waarde: 'omgevingsvisie' },
  });
  const localIntialState = {
    ...initialState,
    ozonLocaties: {
      locaties: [
        {
          identificatie: 'nl.imow-mnre1034.gebiedengroep.201912011101024',
          locatieType: 'Gebiedengroep',
          procedurestatus: 'vastgesteld',
        },
      ],
    },
    documenten: {
      [fromDocumentLocatie.featureKey]: {
        entities: {},
        ids: [],
      },
      documenten: {
        entities: {
          '/akn/nl/act/testArtikelStructuurDocumentId': {
            data: {
              ozon: ozonArtikelStructuurDocumentMock,
            },
            entityId: '/akn/nl/act/testArtikelStructuurDocumentId',
            error: undefined,
            status: 'RESOLVED',
          },
          '/akn/nl/act/testVrijeTekstStructuurDivisieDocumentId': {
            data: {
              ozon: ozonVrijeTekstStructuurDivisieDocumentMock,
            },
            entityId: 'testVrijeTekstStructuurDivisieDocumentId',

            error: undefined,
            status: 'RESOLVED',
          },
          '/akn/nl/act/testVrijeTekstStructuurDivisietekstDocumentId': {
            data: {
              ozon: ozonVrijeTekstStructuurDivisietekstDocumentMock,
            },
            entityId: '/akn/nl/act/testVrijeTekstStructuurDivisietekstDocumentId',
            error: undefined,
            status: 'RESOLVED',
          },
        },
        ids: [
          '/akn/nl/act/testArtikelStructuurDocumentId',
          '/akn/nl/act/testVrijeTekstStructuurDivisieDocumentId',
          '/akn/nl/act/testVrijeTekstStructuurDivisietekstDocumentId',
        ],
      },
    },
  } as any;

  const regeltekst: Regeltekst = {
    identificatie: '/akn/nl/act/testArtikelStructuurDocumentId',
    documentIdentificatie: '/akn/nl/act/testArtikelStructuurDocumentId',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: null,
  };
  const regeltekstenResponse: Regelteksten = {
    _embedded: {
      regelteksten: [regeltekst],
    },
    _links: null,
    page: null,
  };
  const divisieannotatie: Divisieannotatie = {
    identificatie: 'id',
    documentIdentificatie: '/akn/nl/act/documentId',
    geregistreerdMet: {
      beginInwerking: '',
      beginGeldigheid: '',
      tijdstipRegistratie: '',
    },
    _links: null,
  };
  const divisieannotaties: Divisieannotaties = {
    _embedded: {
      divisieannotaties: [divisieannotatie],
    },
    _links: null,
    page: null,
  };

  const createService = createServiceFactory({
    service: StructuurElementFilterEffects,
    providers: [provideMockActions(() => actions$), provideMockStore({ initialState: localIntialState })],
    mocks: [OmgevingsDocumentService],
  });

  beforeEach(() => {
    spectator = createService();
    omgevingsDocumentService = spectator.inject(OmgevingsDocumentService);
  });

  describe('setFilterForArtikelStructuur$', () => {
    it('should set filter with thema', done => {
      omgevingsDocumentService.getRegelteksten$.and.returnValue(of(regeltekstenResponse));
      actions$ = of(
        StructuurelementFilterActions.loadFilter({
          id: '/akn/nl/act/testArtikelStructuurDocumentId',
          document: documentArtikelStructuur,
          beschrijving: 'thema',
          filterType: FilterType.thema,
          themaId: 'thema',
        })
      );
      spectator.service.setFilterForArtikelStructuur$.subscribe(action => {
        expect(action).toEqual(
          StructuurelementFilterActions.loadFilterSuccess({
            id: '/akn/nl/act/testArtikelStructuurDocumentId',
            divisieannotaties: [],
            regelteksten: [
              {
                id: regeltekst.identificatie,
                documentIdentificatie: regeltekst.documentIdentificatie,
                vastgesteld: regeltekst,
              },
            ],
          })
        );
        done();
      });
    });
  });

  describe('setFilterForVrijeTekstStructuur$', () => {
    it('should set filter with hoofdlijn', done => {
      omgevingsDocumentService.getDivisieannotaties$.and.returnValue(of(divisieannotaties));
      actions$ = of(
        StructuurelementFilterActions.loadFilter({
          id: '/akn/nl/act/documentId',
          document: documentVrijeTekstStructuurDivisie,
          beschrijving: 'hoofdlijn',
          filterType: FilterType.hoofdlijn,
          hoofdlijnId: 'hoofdlijn',
        })
      );
      spectator.service.setFilterForVrijeTekstStructuur$.subscribe(action => {
        expect(action).toEqual(
          StructuurelementFilterActions.loadFilterSuccess({
            id: '/akn/nl/act/documentId',
            divisieannotaties: [
              {
                id: divisieannotatie.identificatie,
                documentIdentificatie: divisieannotatie.documentIdentificatie,
                vastgesteld: divisieannotatie,
              },
            ],
            regelteksten: [],
          })
        );
        done();
      });
    });

    it('should set filter with thema', done => {
      omgevingsDocumentService.getDivisieannotaties$.and.returnValue(of(divisieannotaties));
      actions$ = of(
        StructuurelementFilterActions.loadFilter({
          id: '/akn/nl/act/documentId',
          document: documentVrijeTekstStructuurDivisie,
          beschrijving: 'thema',
          filterType: FilterType.thema,
          themaId: 'thema',
        })
      );
      spectator.service.setFilterForVrijeTekstStructuur$.subscribe(action => {
        expect(action).toEqual(
          StructuurelementFilterActions.loadFilterSuccess({
            id: '/akn/nl/act/documentId',
            divisieannotaties: [
              {
                id: divisieannotatie.identificatie,
                documentIdentificatie: divisieannotatie.documentIdentificatie,
                vastgesteld: divisieannotatie,
              },
            ],
            regelteksten: [],
          })
        );
        done();
      });
    });
  });
});
