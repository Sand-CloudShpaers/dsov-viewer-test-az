import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { OzonRegelingenApiEffects } from '~viewer/filtered-results/+state/plannen/ozon-regelingen-api.effects';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import initialState from '~mocks/initial-state';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import { OzonDocumentenService } from '~viewer/filtered-results/services/ozon-documenten.service';
import { mockFilterOptions } from '~viewer/filter/+state/filter.mock';
import { RegelsbeleidType, RegelStatus } from '~model/regel-status.model';
import { FilterName } from '~viewer/filter/types/filter-options';
import { State } from '~store/state';
import { createOmgevingsvergunningMock, createOntwerpRegelingMock, createRegelingMock } from '~mocks/documenten.mock';
import { LOCATIE_ID_TYPE } from '~general/utils/filter.utils';

describe('OzonRegelingenApiEffects', () => {
  let spectator: SpectatorService<OzonRegelingenApiEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let ozonService: SpyObject<OzonDocumentenService>;

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
        regelsbeleid: [
          { id: 'regels', group: 'regelsbeleidType', name: 'Regels' },
          { id: 'geldend', group: 'regelStatus', name: 'Geldend' },
        ],
        thema: [],
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
    service: OzonRegelingenApiEffects,
    providers: [
      provideMockStore({ initialState: localInitialState }),
      provideMockActions(() => actions$),
      mockProvider(OzonDocumentenService),
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    ozonService = spectator.inject(OzonDocumentenService);
  });

  describe('load', () => {
    it('should loading all', done => {
      actions$ = of(PlannenActions.load());

      spectator.service.conditionalLoadVastgesteld$.subscribe(actual => {
        const expected = PlannenActions.ozonLoading({ loadMore: true });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should loading all ontwerp', done => {
      store$.setState({
        ...localInitialState,
        filter: {
          filterOptions: {
            ...mockFilterOptions,
            [FilterName.REGELSBELEID]: [RegelsbeleidType.regels, RegelStatus.InVoorbereiding],
          },
        },
      } as any);
      actions$ = of(PlannenActions.load());

      spectator.service.conditionalLoadOntwerp$.subscribe(actual => {
        const expected = PlannenActions.ozonOntwerpLoading({ loadMore: true });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadOzonVastgesteld', () => {
    it('should load with bestuurslaag', done => {
      ozonService.loadOzonDocumenten$.and.returnValue(
        of([[createRegelingMock()], [createRegelingMock()], [createOmgevingsvergunningMock()]])
      );
      actions$ = of(PlannenActions.ozonLoading({ loadMore: true }));

      spectator.service.loadOzonVastgesteld$.subscribe(actual => {
        const expected = PlannenActions.ozonLoadSuccess({
          regelingen: [createRegelingMock(), createRegelingMock()],
          omgevingsvergunningen: [createOmgevingsvergunningMock()],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadOzonOntwerp', () => {
    it('should load with bestuurslaag', done => {
      ozonService.loadOzonOntwerpDocumenten$.and.returnValue(
        of([[createOntwerpRegelingMock()], [createOntwerpRegelingMock()]])
      );
      ozonService.loadOzonOntwerpDocumenten$.and.returnValue(
        of([[createOntwerpRegelingMock()], [createOntwerpRegelingMock()]])
      );

      actions$ = of(PlannenActions.ozonOntwerpLoading({ loadMore: true }));

      spectator.service.loadOzonOntwerp$.subscribe(actual => {
        const expected = PlannenActions.ozonOntwerpLoadSuccess({
          ontwerpRegelingen: [createOntwerpRegelingMock()],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadMoreOzon', () => {
    it('should load more with bestuurslaag', done => {
      ozonService.loadMore$.and.returnValue(of([createRegelingMock()]));

      actions$ = of(
        PlannenActions.ozonLoadMore({
          fetchUrl: '',
          ozonLocaties: [],
          filterOptions: mockFilterOptions,
        })
      );

      spectator.service.loadMoreOzon$.subscribe(actual => {
        const expected = PlannenActions.ozonLoadMoreSuccess({
          regelingen: [createRegelingMock()],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadMoreOzonOntwerp', () => {
    it('should load more ontwerp with bestuurslaag', done => {
      ozonService.loadMoreOntwerp$.and.returnValue(of([createOntwerpRegelingMock()]));

      actions$ = of(
        PlannenActions.ozonOntwerpLoadMore({
          fetchUrl: '',
          locatieIds: [],
          filterOptions: mockFilterOptions,
          locatieIdType: LOCATIE_ID_TYPE.locatieIdentificatie,
        })
      );

      spectator.service.loadMoreOzonOntwerp$.subscribe(actual => {
        const expected = PlannenActions.ozonOntwerpLoadMoreSuccess({
          ontwerpRegelingen: [createOntwerpRegelingMock()],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadMoreOzonOmgevingsvergunning', () => {
    it('should load more omgevingsvergunning with bestuurslaag', done => {
      ozonService.loadMoreOmgevingsvergunningen$.and.returnValue(of([createOmgevingsvergunningMock()]));

      actions$ = of(
        PlannenActions.ozonOmgevingsvergunningLoadMore({
          fetchUrl: '',
          ozonLocaties: [],
          filterOptions: mockFilterOptions,
        })
      );

      spectator.service.loadMoreOzonOmgevingsvergunning$.subscribe(actual => {
        const expected = PlannenActions.ozonOmgevingsvergunningLoadMoreSuccess({
          omgevingsvergunningen: [createOmgevingsvergunningMock()],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
