import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { SelectionEffects } from './selection.effects';
import { ApiSource } from '~model/internal/api-source';
import * as SelectionActions from './selection.actions';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { commonRootKey, State } from '~store/common';
import initialState from '~mocks/initial-state';
import { selectionFeatureKey } from './selection.reducer';
import { LoadingState } from '~model/loading-state.enum';
import { SelectionObjectType } from '../selection.model';
import { OzonProvider } from '~providers/ozon.provider';
import { verbeeldingMock } from '~store/common/highlight/+state/highlight-mock';
import { IhrProvider } from '~providers/ihr.provider';
import { OmgevingsdocumentlagenService } from '~viewer/kaart/services/omgevingsdocumentlagen.service';
import { createRegelingMock } from '~mocks/documenten.mock';
import { mockFilterOptions } from '~viewer/filter/+state/filter.mock';
import { selectionMockStore } from '~store/common/selection/+state/selection-mock';

describe('SelectionEffects', () => {
  let spectator: SpectatorService<SelectionEffects>;
  let store$: MockStore<State>;
  let actions$: Observable<Action>;
  let ozonProvider: SpyObject<OzonProvider>;
  const spyOnSet = jasmine.createSpy('spyOnSet');

  const GEBIEDSAANWIJZING = 'nl.imow-gm0297.gebiedsaanwijzing.2019000003';
  const OMGEVINGSNORM = 'nl.imow-gm0297.omgevingsnorm.2019000003';
  const OMGEVINGSNORMWAARDE = 'nl.imow-gm0297.omgevingsnorm.2019000003-10-meter';
  const DOCUMENT_ID = '/akn/nl/act/1034';

  const initialPlannenState = {
    entities: {},
    status: 'RESOLVED',
  };

  const mockRegeling = createRegelingMock({
    identificatie: DOCUMENT_ID,
    type: {
      code: 'regeling',
      waarde: 'regeling',
    },
  });

  const localInitialState = {
    ...selectionMockStore,
    filteredResults: {
      plannen: {
        ihr: {
          gemeente: initialPlannenState,
          provincie: initialPlannenState,
          rijk: initialPlannenState,
        },
        ozon: {
          gemeente: {
            entities: {
              [DOCUMENT_ID]: {
                entityId: DOCUMENT_ID,
                data: mockRegeling,
                status: LoadingState.RESOLVED,
              },
            },
            status: LoadingState.RESOLVED,
          },
          provincie: initialPlannenState,
          waterschap: initialPlannenState,
          rijk: initialPlannenState,
          status: LoadingState.RESOLVED,
        },
        ozonOntwerp: {
          gemeente: initialPlannenState,
          provincie: initialPlannenState,
          waterschap: initialPlannenState,
          rijk: initialPlannenState,
          status: LoadingState.RESOLVED,
        },
        isDirty: false,
      },
    },
    filter: {
      filterOptions: {
        ...mockFilterOptions,
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: SelectionEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: localInitialState }),
      mockProvider(OzonProvider),
      mockProvider(IhrProvider),
      mockProvider(OmgevingsdocumentlagenService, {
        set: spyOnSet,
      }),
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    spyOn(store$, 'dispatch').and.stub();
    ozonProvider = spectator.inject(OzonProvider);
  });

  describe('removeObsoleteSelections$', () => {
    it('should remove selections', done => {
      actions$ = of(PlannenActions.ozonLoadSuccess({ regelingen: [mockRegeling], omgevingsvergunningen: [] }));

      spectator.service.removeObsoleteSelections$.subscribe(actual => {
        const expected = SelectionActions.removeSelections({
          selections: [
            {
              id: '/akn/nl/act/1034',
              documentDto: { documentId: '/akn/nl/act/1034', documentType: 'regeling' },
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.REGELINGSGEBIED,
              name: 'document',
            },
          ],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('getVerbeeldingenOzon$', () => {
    it('should loadVerbeeldingSuccess', done => {
      ozonProvider.fetchVerbeelding$.and.returnValue(of(verbeeldingMock));
      actions$ = of(SelectionActions.addSelections({ selections: [] }));

      spectator.service.loadVerbeeldingOzon$.subscribe(actual => {
        const expected = SelectionActions.loadVerbeeldingSuccess({
          verbeelding: verbeeldingMock,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadVerbeeldingSuccess$', () => {
    it('should update selections with symboolcode', done => {
      actions$ = of(SelectionActions.loadVerbeeldingSuccess({ verbeelding: verbeeldingMock }));

      spectator.service.loadVerbeeldingSuccess$.subscribe(actual => {
        const expected = SelectionActions.updateSelections({
          selections: [
            {
              id: GEBIEDSAANWIJZING,
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.GEBIEDSAANWIJZING,
              name: 'gebiedje',
              symboolcode: 'vsgt304',
            },
            {
              id: OMGEVINGSNORMWAARDE,
              parentId: OMGEVINGSNORM,
              parentName: 'norm',
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
              name: 'normwaarde',
              symboolcode: 'vag100',
            },
            {
              id: DOCUMENT_ID,
              documentDto: {
                documentId: DOCUMENT_ID,
                documentType: 'regeling',
              },
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.REGELINGSGEBIED,
              name: 'document',
              symboolcode: undefined,
            },
          ],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('resetOmgevingsdocumentlagen$', () => {
    it('should not resetOmgevingsdocumentlagen', done => {
      spyOnSet.calls.reset();

      actions$ = of(SelectionActions.addSelections({ selections: [] }));

      spectator.service.resetOmgevingsdocumentlagen$.subscribe(() => {
        expect(spyOnSet).not.toHaveBeenCalled();

        done();
      });
    });
  });
});

describe('SelectionEffects with no Ozon', () => {
  let spectator: SpectatorService<SelectionEffects>;
  let store$: MockStore<State>;
  let actions$: Observable<Action>;
  const spyOnSet = jasmine.createSpy('spyOnSet');

  const GEBIEDSAANDUIDING = 'gebiedsaanduiding';
  const BESTEMMINGSVLAK = 'bestemmingsvlak';

  const initialPlannenState = {
    entities: {},
    status: 'RESOLVED',
  };

  const localInitialStateNoOzon = {
    ...initialState,
    filteredResults: {
      plannen: {
        ihr: {
          gemeente: initialPlannenState,
          provincie: initialPlannenState,
          rijk: initialPlannenState,
        },
        ozon: initialPlannenState,
        ozonOntwerp: initialPlannenState,
        isDirty: false,
      },
    },
    [commonRootKey]: {
      [selectionFeatureKey]: {
        ids: [GEBIEDSAANDUIDING, BESTEMMINGSVLAK],
        entities: {
          [GEBIEDSAANDUIDING]: {
            status: LoadingState.RESOLVED,
            entityId: GEBIEDSAANDUIDING,
            data: {
              id: GEBIEDSAANDUIDING,
              documentDto: undefined,
              apiSource: ApiSource.IHR,
              objectType: SelectionObjectType.GEBIEDSAANDUIDING,
              symboolHref: 'href',
              name: 'gebiedsaanduiding',
              symboolcode: 'gebiedsaanduiding',
            },
          },
          [BESTEMMINGSVLAK]: {
            status: LoadingState.RESOLVED,
            entityId: BESTEMMINGSVLAK,
            data: {
              id: BESTEMMINGSVLAK,
              documentDto: undefined,
              apiSource: ApiSource.IHR,
              objectType: SelectionObjectType.BESTEMMINGSVLAK,
              symboolHref: 'href',
              name: 'bestemmingsvlak',
              symboolcode: 'groep',
            },
          },
        },
        error: null,
      },
    },
    filter: {
      filterOptions: {
        ...mockFilterOptions,
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: SelectionEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: localInitialStateNoOzon }),
      mockProvider(OzonProvider),
      mockProvider(IhrProvider),
      mockProvider(OmgevingsdocumentlagenService, {
        set: spyOnSet,
      }),
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    spyOn(store$, 'dispatch').and.stub();
  });

  describe('showSelectionsOnMapWhenAllSymbolsInStore$', () => {
    it('should call showSelectionsOnMap when all symbolcodes are stored', done => {
      actions$ = of(SelectionActions.addSelections({ selections: [] }));

      spectator.service.showSelectionsOnMapWhenAllSymbolsInStore$.subscribe(actual => {
        const expected = SelectionActions.showSelectionsOnMap();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('resetOmgevingsdocumentlagen', () => {
    it('should resetOmgevingsdocumentlagen', done => {
      spyOnSet.calls.reset();

      actions$ = of(SelectionActions.addSelections({ selections: [] }));

      spectator.service.resetOmgevingsdocumentlagen$.subscribe(() => {
        expect(spyOnSet).toHaveBeenCalledWith(undefined, [], false);

        done();
      });
    });
  });
});
