import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import Point from 'ol/geom/Point';
import { Observable, of } from 'rxjs';
import initialState from '~mocks/initial-state';
import { createRegelingMock } from '~mocks/documenten.mock';
import { TekstCollectie } from '~ihr-model/tekstCollectie';
import { ApiSource } from '~model/internal/api-source';
import { LoadingState } from '~model/loading-state.enum';
import { RegelsOpMaatEffects } from './regels-op-maat.effects';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';
import * as RegelsOpMaatDocumentActions from '~viewer/regels-op-maat/+state/document/document.actions';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { State } from './index';
import { Regelingen } from '~ozon-model/regelingen';
import { Regelteksten } from '~ozon-model/regelteksten';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { ConfigService, OZON_PAGE_SIZE } from '~services/config.service';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';
import { OntwerpRegelteksten } from '~ozon-model/ontwerpRegelteksten';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { OntwerpRegeltekstZoekParameter } from '~ozon-model/ontwerpRegeltekstZoekParameter';
import { Divisieannotaties } from '~ozon-model/divisieannotaties';
import { OntwerpDivisieannotaties } from '~ozon-model/ontwerpDivisieannotaties';
import { OntwerpDivisieannotatieZoekParameter } from '~ozon-model/ontwerpDivisieannotatieZoekParameter';
import { mockFilterOptions } from '~viewer/filter/+state/filter.mock';
import { FilterName } from '~viewer/filter/types/filter-options';
import { LOCATIE_ID_TYPE } from '~general/utils/filter.utils';
import { LocationType } from '~model/internal/active-location-type.model';
import { OzonDocumentenService } from '~viewer/filtered-results/services/ozon-documenten.service';

describe('RegelsOpMaatEffects', () => {
  let spectator: SpectatorService<RegelsOpMaatEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let omgevingsDocumentService: SpyObject<OmgevingsDocumentService>;
  let ozonDocumentenService: SpyObject<OzonDocumentenService>;
  let ihrDocumentService: SpyObject<IhrDocumentService>;

  const documentId = documentDtoMock.documentId;
  const localInitialState = {
    ...initialState,
    common: {
      ozonLocaties: {
        locatieIds: ['nl.imow-mnre1034.gebiedengroep.201912011101024'],
      },
    },
    filter: {
      filterOptions: {
        ...mockFilterOptions,
        [FilterName.ACTIVITEIT]: [
          {
            id: 'activiteit',
            name: 'activiteit',
          },
        ],
        [FilterName.LOCATIE]: [
          {
            name: 'coordinaten',
            id: 'coordinaten',
            source: LocationType.CoordinatenRD,
            geometry: new Point([1, 2]),
          },
        ],
      },
    },
    regelsOpMaat: {
      document: {
        entities: {
          [documentId]: {
            status: LoadingState.RESOLVED,
            data: {
              documentId,
              apiSource: ApiSource.OZON,
              zoekParameters: [],
              regelteksten: [],
              divisies: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  regelteksten: {
                    href: 'url',
                    zoekParameters: [
                      {
                        parameter: 'documentIdentificatie',
                        zoekWaarden: [documentId],
                      },
                      {
                        parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
                        zoekWaarden: [],
                      },
                    ],
                  },
                },
              },
              statusLoadMore: LoadingState.RESOLVED,
            },
            entityId: documentId,
          },
        },
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: RegelsOpMaatEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: localInitialState }),
      {
        provide: ConfigService,
        useValue: {
          config: {
            ozon: {
              url: 'https://ozon.kadaster.nl',
              apiKey: 'een hele mooie key',
            },
          },
          ozonMaxResponseSize: OZON_PAGE_SIZE,
        },
      },
    ],
    mocks: [OmgevingsDocumentService, OzonDocumentenService, IhrDocumentService, FilterFacade],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    omgevingsDocumentService = spectator.inject(OmgevingsDocumentService);
    ozonDocumentenService = spectator.inject(OzonDocumentenService);
    ihrDocumentService = spectator.inject(IhrDocumentService);
  });

  describe('loadRegelsOpMaat', () => {
    it('should loadRegelsOpMaat, with activiteiten', done => {
      actions$ = of(RegelsOpMaatActions.loadRegelsOpMaat());

      spectator.service.loadRegelsOpMaat$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatDocumenten({
          regelsUrl: 'https://ozon.kadaster.nl/regelingen/regels/_zoek?page=0&size=200',
          tekstdelenUrl: 'https://ozon.kadaster.nl/regelingen/tekstdelen/_zoek?page=0&size=200',
          documents: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelsOpMaatWithDocuments', () => {
    const document: DocumentDto = {
      documentId,
      documentType: '',
    };

    it('should loadRegelsOpMaat, with documenten', done => {
      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.DOCUMENTEN]: [
              {
                id: documentId,
                name: 'ander document',
                document,
              },
            ],
          },
        },
      } as any);
      actions$ = of(RegelsOpMaatActions.loadRegelsOpMaat());

      spectator.service.loadRegelsOpMaatWithDocuments$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: [document],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelsOpMaatWithoutDocumentsOzonRegelingen$', () => {
    const document: DocumentDto = {
      documentId: '/akn/nl/act/ander_document',
      documentType: '',
    };

    it('should load regelingen', done => {
      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.DOCUMENTEN]: [
              {
                id: '/akn/nl/act/ander_document',
                name: 'ander document',
                document,
              },
            ],
          },
        },
      } as any);
      actions$ = of(RegelsOpMaatActions.loadRegelsOpMaat());

      ozonDocumentenService.loadOzonDocumenten$.and.returnValue(of([[createRegelingMock()], [], []]));
      spectator.service.loadRegelsOpMaatWithoutDocumentsOzonRegelingen$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: [document],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelsOpMaatWithoutDocumentsNotOzonRegelingen$', () => {
    it('should loadRegelsOpMaat, with ozon ontwerpregelingen', done => {
      const document: DocumentDto = {
        documentId: 'akn_nl_bill',
        documentType: '',
      };

      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.DOCUMENTEN]: [
              {
                id: 'akn_nl_bill',
                name: 'ik ben een ontwerpregeling',
                document,
              },
            ],
          },
        },
      } as any);
      actions$ = of(RegelsOpMaatActions.loadRegelsOpMaat());

      spectator.service.loadRegelsOpMaatWithoutDocumentsNotOzonRegelingen$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: [document],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should loadRegelsOpMaat, with ihr plannen', done => {
      const document: DocumentDto = {
        documentId: 'NL.IMRO',
        documentType: '',
      };

      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.DOCUMENTEN]: [
              {
                id: 'NL.IMRO',
                name: 'ik ben een IHR plan',
                document,
              },
            ],
          },
        },
      } as any);
      actions$ = of(RegelsOpMaatActions.loadRegelsOpMaat());

      spectator.service.loadRegelsOpMaatWithoutDocumentsNotOzonRegelingen$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: [document],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('iterateOverDocuments', () => {
    it('should dispatch loadRegelsOpMaatPerDocument', done => {
      const documents: DocumentDto[] = [documentDtoMock];
      store$.setState(localInitialState as any);
      spyOn(store$, 'dispatch').and.stub();
      actions$ = of(RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({ documents }));

      spectator.service.iterateOverDocuments$.subscribe(() => {
        expect(store$.dispatch).toHaveBeenCalledWith(
          RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
            document: documents[0],
          })
        );
        done();
      });
    });
  });

  describe('loadRegelsOpMaatDocumenten', () => {
    it('should loadRegelsOpMaatDocumenten', done => {
      const omgevingsdocumentenResponse: Regelingen = {
        _embedded: { regelingen: [createRegelingMock()] },
        _links: {
          self: { href: '' },
        },
        page: {
          size: 0,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };

      omgevingsDocumentService.getOmgevingsDocumenten$.and.returnValue(of([omgevingsdocumentenResponse]));
      actions$ = of(
        RegelsOpMaatActions.loadRegelsOpMaatDocumenten({
          regelsUrl: 'url',
          tekstdelenUrl: 'url',
          documents: [],
        })
      );

      spectator.service.loadRegelsOpMaatDocumenten$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: [
            {
              documentId: createRegelingMock().identificatie,
              documentType: createRegelingMock().type.waarde,
            },
          ],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelsOpMaatDocumenten, with documents', () => {
    it('should load more loadRegelsOpMaatDocumenten', done => {
      const omgevingsdocumentenResponse: Regelingen = {
        _embedded: { regelingen: [createRegelingMock()] },
        _links: {
          self: { href: '' },
          next: { href: 'next' },
        },
        page: {
          size: 0,
          totalElements: 0,
          totalPages: 0,
          number: 0,
        },
      };

      omgevingsDocumentService.getOmgevingsDocumenten$.and.returnValue(of([omgevingsdocumentenResponse]));
      actions$ = of(
        RegelsOpMaatActions.loadRegelsOpMaatDocumenten({
          regelsUrl: 'url',
          tekstdelenUrl: 'url',
          documents: [documentDtoMock],
        })
      );

      spectator.service.loadRegelsOpMaatDocumenten$.subscribe(actual => {
        const expected = RegelsOpMaatActions.loadRegelsOpMaatDocumenten({
          documents: [
            documentDtoMock,
            {
              documentId: createRegelingMock().identificatie,
              documentType: createRegelingMock().type.waarde,
            },
          ],
          regelsUrl: 'next',
          tekstdelenUrl: undefined,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelteksten', () => {
    it('should loadRegelteksten', done => {
      const document = { ...documentDtoMock, documentType: 'amvb' };
      const regeltekstenResponse: Regelteksten = {
        _embedded: {
          regelteksten: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };

      omgevingsDocumentService.getRegelteksten$.and.returnValue(of(regeltekstenResponse));
      actions$ = of(
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
          document,
        })
      );

      spectator.service.loadRegelteksten$.subscribe(actual => {
        const expected = RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
          document,
          apiSource: ApiSource.OZON,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: {
              regelteksten: {
                href: '',
                zoekParameters: [
                  { parameter: 'documentIdentificatie', zoekWaarden: ['/akn/nl/act/documentId'] },
                  {
                    parameter: 'locatie.identificatie',
                    zoekWaarden: ['nl.imow-mnre1034.gebiedengroep.201912011101024'],
                  },
                  { parameter: 'activiteit.identificatie', zoekWaarden: ['activiteit'] },
                ],
              },
            },
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadRegelsOpMaatPerDocumentSuccess', () => {
    it('should loadOntwerpRegelteksten', done => {
      const document = { documentId: 'akn_nl_bill', documentType: 'amvb' };

      const ontwerpRegeltekstenResponse: OntwerpRegelteksten = {
        _embedded: {
          ontwerpRegelteksten: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };
      const ontwerpRegeltekstenResponse2: OntwerpRegelteksten = {
        _embedded: {
          ontwerpRegelteksten: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };

      omgevingsDocumentService.getOntwerpRegelteksten$.and.returnValue(of(ontwerpRegeltekstenResponse));
      omgevingsDocumentService.getOntwerpRegelteksten$.and.returnValue(of(ontwerpRegeltekstenResponse2));
      actions$ = of(
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
          document,
        })
      );

      spectator.service.loadOntwerpRegelteksten$.subscribe(actual => {
        const expected = RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
          document,
          apiSource: ApiSource.OZON,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: {},
            ontwerp: {
              regeltekstenVastgesteldeLocaties: {
                href: '',
                zoekParameters: [
                  {
                    parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
                    zoekWaarden: ['akn_nl_bill'],
                  },
                  {
                    parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.LocatieIdentificatie,
                    zoekWaarden: ['nl.imow-mnre1034.gebiedengroep.201912011101024'],
                  },
                  { parameter: 'activiteit.identificatie', zoekWaarden: ['activiteit'] },
                ],
              },
              regeltekstenOntwerpLocaties: {
                href: '',
                zoekParameters: [
                  {
                    parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
                    zoekWaarden: ['akn_nl_bill'],
                  },
                  {
                    parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId,
                    zoekWaarden: undefined,
                  },
                  { parameter: 'activiteit.identificatie', zoekWaarden: ['activiteit'] },
                ],
              },
            },
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadMoreRegelteksten', () => {
    it('should loadMoreRegelteksten', done => {
      const document = { ...documentDtoMock, documentType: 'amvb' };
      const regeltekstenResponse: Regelteksten = {
        _embedded: {
          regelteksten: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };

      omgevingsDocumentService.post$.and.returnValue(of(regeltekstenResponse));
      actions$ = of(
        RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocument({
          document,
        })
      );

      spectator.service.loadMoreRegelteksten$.subscribe(actual => {
        const expected = RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocumentSuccess({
          document,
          apiSource: ApiSource.OZON,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: {
              regelteksten: {
                href: '',
                zoekParameters: [
                  {
                    parameter: 'documentIdentificatie',
                    zoekWaarden: [documentId],
                  },
                  {
                    parameter: LOCATIE_ID_TYPE.locatieIdentificatie,
                    zoekWaarden: [],
                  },
                ],
              },
            },
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadDivisies', () => {
    it('should loadDivisies', done => {
      const document = { ...documentDtoMock, documentType: 'omgevingsvisie' };
      const divisieannotatiesResponse: Divisieannotaties = {
        _embedded: {
          divisieannotaties: [],
        },
        _links: { next: { href: 'divisies' } },
        page: null,
      };

      omgevingsDocumentService.getDivisieannotaties$.and.returnValue(of(divisieannotatiesResponse));
      actions$ = of(
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
          document,
        })
      );

      spectator.service.loadDivisies$.subscribe(actual => {
        const expected = RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
          document,
          apiSource: ApiSource.OZON,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: {
              divisieannotaties: {
                href: 'divisies',
                zoekParameters: [
                  { parameter: 'documentIdentificatie', zoekWaarden: ['/akn/nl/act/documentId'] },
                  {
                    parameter: 'locatie.identificatie',
                    zoekWaarden: ['nl.imow-mnre1034.gebiedengroep.201912011101024'],
                  },
                  { parameter: 'activiteit.identificatie', zoekWaarden: ['activiteit'] },
                ],
              },
            },
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadOntwerpDivisies', () => {
    it('should loadOntwerpDivisies', done => {
      const document = { documentId: 'akn_nl_bill', documentType: 'omgevingsvisie' };

      const OntwerpDivisieannotatiesResponse: OntwerpDivisieannotaties = {
        _embedded: {
          ontwerpdivisieannotaties: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };
      const OntwerpDivisieannotatiesResponse2: OntwerpDivisieannotaties = {
        _embedded: {
          ontwerpdivisieannotaties: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };

      omgevingsDocumentService.getOntwerpDivisieannotaties$.and.returnValue(of(OntwerpDivisieannotatiesResponse));
      omgevingsDocumentService.getOntwerpDivisieannotaties$.and.returnValue(of(OntwerpDivisieannotatiesResponse2));

      actions$ = of(
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
          document,
        })
      );

      spectator.service.loadOntwerpDivisies$.subscribe(actual => {
        const expected = RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
          document,
          apiSource: ApiSource.OZON,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: {},
            ontwerp: {
              divisieannotatiesVastgesteldeLocaties: {
                href: '',
                zoekParameters: [
                  {
                    parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
                    zoekWaarden: ['akn_nl_bill'],
                  },
                  {
                    parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.LocatieIdentificatie,
                    zoekWaarden: ['nl.imow-mnre1034.gebiedengroep.201912011101024'],
                  },
                  { parameter: 'activiteit.identificatie', zoekWaarden: ['activiteit'] },
                ],
              },
              divisieannotatiesOntwerpLocaties: {
                href: '',
                zoekParameters: [
                  {
                    parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
                    zoekWaarden: ['akn_nl_bill'],
                  },
                  {
                    parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerplocatieTechnischId,
                    zoekWaarden: undefined,
                  },
                  { parameter: 'activiteit.identificatie', zoekWaarden: ['activiteit'] },
                ],
              },
            },
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadTeksten', () => {
    it('should loadTeksten', done => {
      const document: DocumentDto = {
        ...documentDtoMock,
        documentType: null,
        documentId: 'NL.IMRO.1234',
      };
      const teksten: TekstCollectie = {
        _embedded: {
          teksten: [],
        },
        _links: {
          self: { href: '' },
          next: { href: '' },
        },
      };

      ihrDocumentService.getIhrDocumentArtikelen$.and.returnValue(of(teksten));
      actions$ = of(
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
          document,
        })
      );

      spectator.service.loadTeksten$.subscribe(actual => {
        const expected = RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
          document,
          apiSource: ApiSource.IHR,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
