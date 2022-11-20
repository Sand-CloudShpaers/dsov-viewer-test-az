import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import initialState from '~mocks/initial-state';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { FilterEffects } from './filter.effects';
import * as FilterActions from './filter.actions';
import { FilterFacade } from '../filter.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { RegelsbeleidType, RegelStatus, RegelStatusType } from '~model/regel-status.model';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterName } from '../types/filter-options';
import { State } from '~store/state';
import { mockFilterOptions } from './filter.mock';
import { LocationType } from '~model/internal/active-location-type.model';
import { documentDtoMock } from '~viewer/documenten/types/documentDto.mock';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import * as SelectionActions from '~store/common/selection/+state/selection.actions';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import WKT from 'ol/format/WKT';
import { OmgevingsdocumentlagenService } from '~viewer/kaart/services/omgevingsdocumentlagen.service';

describe('FilterEffects', () => {
  let spectator: SpectatorService<FilterEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let router: SpyObject<Router>;
  let portaalSessionPutService: SpyObject<PortaalSessionPutService>;
  const spyOnSetFilters = jasmine.createSpy('spyOnSetFilters');

  const localInitialState = {
    ...initialState,
    filter: {
      filterOptions: {
        ...mockFilterOptions,
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: FilterEffects,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: GegevenscatalogusProvider,
        useValue: {
          getDocumenttypes$: () => of([]),
          getRegelgevingTypes$: () => of([]),
        },
      },
      provideMockStore({ initialState: localInitialState }),
      provideMockActions(() => actions$),
      mockProvider(FilterFacade, {
        updateFilters: spyOnSetFilters,
      }),
      mockProvider(NavigationService),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { queryParams: { [FilterName.REGELSBELEID]: 'regels' } },
        },
      },
      mockProvider(OmgevingsdocumentlagenService),
    ],
    mocks: [PortaalSessionPutService],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    portaalSessionPutService = spectator.inject(PortaalSessionPutService);
    router = spectator.inject(Router);
    spyOn(store$, 'dispatch').and.stub();
  });

  describe('resetFilters$', () => {
    it('should call action UpdateFiltersSuccess', done => {
      actions$ = of(
        FilterActions.ResetFilters({
          filterNames: [FilterName.LOCATIE],
          commands: [],
        })
      );

      spectator.service.resetFilters$.subscribe(actual => {
        const expected = FilterActions.UpdateFiltersSuccess({
          commands: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('updateFilters$', () => {
    it('should call action FinalizeFilters, with location', done => {
      const filterOptions = {
        [FilterName.LOCATIE]: [
          {
            id: 'locatie',
            name: 'locatie',
            geometry: new WKT().readGeometry(
              'MULTIPOLYGON(((128560 453107,129118 452937,129299 452854,129682 452722)))',
              {
                dataProjection: 'EPSG:28992',
              }
            ),
          },
        ],
      };

      actions$ = of(
        FilterActions.UpdateFilters({
          filterOptions,
          commands: [],
        })
      );

      spectator.service.updateFilters$.subscribe(actual => {
        const expected = FilterActions.UpdateFiltersSuccess({
          filterOptions,
          commands: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should call action FinalizeFilters, without location', done => {
      const filterOptions = {
        [FilterName.ACTIVITEIT]: [{ id: 'activiteit', name: 'activiteit' }],
      };
      actions$ = of(
        FilterActions.UpdateFilters({
          filterOptions,
          commands: [],
        })
      );

      spectator.service.updateFilters$.subscribe(actual => {
        const expected = FilterActions.UpdateFiltersSuccess({
          filterOptions,
          commands: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('resetSelections$', () => {
    it('should call SelectionActions.resetSelections after resetAllFilters', done => {
      actions$ = of(
        FilterActions.ResetAllFilters({
          commands: [],
        })
      );

      spectator.service.resetSelections$.subscribe(actual => {
        expect(actual).toEqual(SelectionActions.resetSelections({ excludeDocuments: false }));
        done();
      });
    });

    it('should call SelectionActions.resetSelections after removeFilter', done => {
      actions$ = of(
        FilterActions.RemoveFilter({
          namedFilter: {
            name: FilterName.LOCATIE,
            filter: {
              id: 'locatie',
              name: 'locatie',
              geometry: new WKT().readGeometry(
                'MULTIPOLYGON(((128560 453107,129118 452937,129299 452854,129682 452722)))',
                {
                  dataProjection: 'EPSG:28992',
                }
              ),
            },
          },
          commands: [],
        })
      );

      spectator.service.resetSelections$.subscribe(actual => {
        expect(actual).toEqual(SelectionActions.resetSelections({ excludeDocuments: false }));
        done();
      });
    });
  });

  describe('getFiltersFromQueryParams$', () => {
    it('should set filters with regels', done => {
      const route = {
        snapshot: { queryParams: { [FilterName.REGELSBELEID]: 'regels', [FilterName.LOCATIE]: 'dorpstraat 1' } },
      } as unknown as ActivatedRoute;
      actions$ = of(
        FilterActions.GetFiltersFromQueryParams({
          queryParams: route.snapshot.queryParams,
        })
      );

      spectator.service.getFiltersFromQueryParams$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            locatie: [{ id: 'dorpstraat 1', name: 'dorpstraat 1', geometry: null }],
            activiteit: [],
            gebieden: [],
            thema: [],
            regelsbeleid: [RegelsbeleidType.regels],
            documenten: [],
            regelgeving_type: [],
            document_type: [],
            datum: [],
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should set filters with beleid', done => {
      const route = {
        snapshot: { queryParams: { regelsbeleid: 'beleid' } },
      } as unknown as ActivatedRoute;
      actions$ = of(
        FilterActions.GetFiltersFromQueryParams({
          queryParams: route.snapshot.queryParams,
        })
      );

      spectator.service.getFiltersFromQueryParams$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            locatie: [],
            activiteit: [],
            gebieden: [],
            thema: [],
            regelsbeleid: [RegelsbeleidType.beleid],
            documenten: [],
            datum: [],
            regelgeving_type: [],
            document_type: [],
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should set filters with geldend and datum, for timetraveling', done => {
      const route = {
        snapshot: { queryParams: { regelsbeleid: 'geldend', datum: '12-12-2020' } },
      } as unknown as ActivatedRoute;
      actions$ = of(
        FilterActions.GetFiltersFromQueryParams({
          queryParams: route.snapshot.queryParams,
        })
      );

      spectator.service.getFiltersFromQueryParams$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            locatie: [],
            activiteit: [],
            gebieden: [],
            thema: [],
            regelsbeleid: [RegelStatusType[RegelStatus.Geldend]],
            documenten: [],
            regelgeving_type: [],
            document_type: [],
            datum: [{ id: 'timetravel', name: 'tijdreizen', timeTravelDate: '12-12-2020', label: { hide: true } }],
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('setLocationQueryParams, with coordinates location', () => {
    it('should navigate with query params', done => {
      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.LOCATIE]: [
              {
                name: '10, 10',
                geometry: null,
                coordinaten: {
                  [ZoekLocatieSystem.RD]: [10, 10],
                  system: ZoekLocatieSystem.RD,
                },
                source: LocationType.CoordinatenRD,
              },
            ],
          },
        },
      } as any);

      actions$ = of(FilterActions.UpdateFiltersSuccess({ commands: [] }));

      const queryParams: { [key: string]: string } = {
        documenten: null,
        activiteit: null,
        gebieden: null,
        thema: null,
        regelsbeleid: null,
        document_type: null,
        regelgeving_type: null,
        instructieregelInstrument: null,
        instructieregelTaakuitoefening: null,
        'locatie-x': '10',
        'locatie-y': '10',
        'locatie-stelsel': 'RD',
        'no-zoom': 'false',
      };

      const navigateSpy = spyOn(router, 'navigate').and.stub();

      spectator.service.updateFiltersSuccess$.subscribe(() => {
        expect(navigateSpy).toHaveBeenCalledWith([], { queryParamsHandling: 'merge', queryParams });
        done();
      });
    });
  });

  describe('setLocationQueryParams, with location', () => {
    it('should navigate with query params', done => {
      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.LOCATIE]: [
              {
                name: 'dorpstraat 1',
                geometry: null,
                source: LocationType.Adres,
              },
            ],
            [FilterName.ACTIVITEIT]: [
              {
                id: 'activiteit',
                name: 'activiteit',
              },
            ],
            [FilterName.GEBIEDEN]: [
              {
                id: 'gebied',
                name: 'gebied',
              },
            ],
            [FilterName.THEMA]: [
              {
                id: 'thema',
                name: 'thema',
              },
            ],
            [FilterName.REGELSBELEID]: [RegelsbeleidType.regels],
            [FilterName.DOCUMENTEN]: [
              {
                id: 'document',
                name: 'document',
                document: documentDtoMock,
              },
            ],
          },
        },
      } as any);

      actions$ = of(FilterActions.UpdateFiltersSuccess({ commands: [] }));

      const queryParams: { [key: string]: string } = {
        regelsbeleid: 'regels',
        instructieregelInstrument: null,
        instructieregelTaakuitoefening: null,
        documenten: '[{"documentId":"/akn/nl/act/documentId","documentType":"Omgevingsplan"}]',
        activiteit: '[{"id":"activiteit","name":"activiteit"}]',
        gebieden: '[{"id":"gebied","name":"gebied"}]',
        thema: '[{"id":"thema","name":"thema"}]',
        locatie: 'dorpstraat 1',
        document_type: null,
        regelgeving_type: null,
      };

      const navigateSpy = spyOn(router, 'navigate').and.stub();

      spectator.service.updateFiltersSuccess$.subscribe(() => {
        expect(portaalSessionPutService.sendActivitiesToPortal).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith([], { queryParamsHandling: 'merge', queryParams });
        done();
      });
    });
  });
});
