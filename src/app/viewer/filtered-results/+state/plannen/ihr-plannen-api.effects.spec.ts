import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { mockFilterOptions } from '~viewer/filter/+state/filter.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { OzonDocumentenService } from '~viewer/filtered-results/services/ozon-documenten.service';
import { IhrPlannenApiEffects } from '~viewer/filtered-results/+state/plannen/ihr-plannen-api.effects';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { IhrPlannenService } from '~viewer/filtered-results/services/ihr-plannen.service';
import { createIhrPlanMock } from '~mocks/documenten.mock';
import { FilterName } from '~viewer/filter/types/filter-options';
import { LocationType } from '~model/internal/active-location-type.model';
import Point from 'ol/geom/Point';

describe('IhrPlannenApiEffects', () => {
  let spectator: SpectatorService<IhrPlannenApiEffects>;
  let actions$: Observable<Action>;
  let ihrService: SpyObject<IhrPlannenService>;

  const initialPlannenState = {
    entities: {},
    status: 'RESOLVED',
  };

  const localInitialState = {
    ...initialState,
    common: {
      ozonLocaties: {
        locatieIds: [
          {
            identificatie: 'nl.imow-mnre1034.gebiedengroep.201912011101024',
            locatieType: 'Gebiedengroep',
            procedurestatus: 'vastgesteld',
          },
        ],
      },
    },
    filter: {
      filterOptions: {
        ...mockFilterOptions,
        [FilterName.REGELSBELEID]: [
          { id: 'regels', group: 'regelsbeleidType', name: 'Regels' },
          { id: 'geldend', group: 'regelStatus', name: 'Geldend' },
        ],
        [FilterName.THEMA]: [],
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
    filteredResults: {
      plannen: {
        ihr: {
          gemeente: initialPlannenState,
          provincie: initialPlannenState,
          rijk: initialPlannenState,
        },
        ozon: {
          gemeente: initialPlannenState,
          provincie: initialPlannenState,
          waterschap: initialPlannenState,
          rijk: initialPlannenState,
        },
        ozonOntwerp: {
          gemeente: initialPlannenState,
          provincie: initialPlannenState,
          waterschap: initialPlannenState,
          rijk: initialPlannenState,
        },
        isDirty: false,
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: IhrPlannenApiEffects,
    providers: [
      provideMockStore({ initialState: localInitialState }),
      provideMockActions(() => actions$),
      mockProvider(OzonDocumentenService),
      mockProvider(IhrPlannenService),
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
    ihrService = spectator.inject(IhrPlannenService);
  });

  describe('load', () => {
    it('should load Ihr plannen for gemeente', done => {
      actions$ = of(PlannenActions.load());
      spectator.service.loadOnNavigationGemeente$.subscribe(actual => {
        const expected = PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.GEMEENTE });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should load Ihr plannen for provincie', done => {
      actions$ = of(PlannenActions.load());
      spectator.service.loadOnNavigationProvincie$.subscribe(actual => {
        const expected = PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.PROVINCIE });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should load Ihr plannen for rijk', done => {
      actions$ = of(PlannenActions.load());
      spectator.service.loadOnNavigationRijk$.subscribe(actual => {
        const expected = PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.RIJK });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should load Ihr plannen', done => {
      ihrService.loadDocsByGeometry$.and.returnValue(of([createIhrPlanMock()]));
      actions$ = of(PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.GEMEENTE }));

      spectator.service.loadIhr$.subscribe(actual => {
        const expected = PlannenActions.ihrLoadSuccess({
          ihrPlannen: [createIhrPlanMock()],
          bestuurslaag: Bestuurslaag.GEMEENTE,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadMoreIhr', () => {
    it('should load more with bestuurslaag', done => {
      ihrService.loadMorePlannen$.and.returnValue(of([createIhrPlanMock()]));

      actions$ = of(
        PlannenActions.ihrLoadMore({
          href: '',
          bestuurslaag: Bestuurslaag.GEMEENTE,
        })
      );

      spectator.service.loadMoreIhr$.subscribe(actual => {
        const expected = PlannenActions.ihrLoadMoreSuccess({
          ihrPlannen: [createIhrPlanMock()],
          bestuurslaag: Bestuurslaag.GEMEENTE,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
