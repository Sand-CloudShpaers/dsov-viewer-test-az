import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { HighlightEffects } from './highlight.effects';
import { ApiSource } from '~model/internal/api-source';
import * as HighlightActions from './highlight.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { commonRootKey, State } from '~store/common';
import initialState from '~mocks/initial-state';
import { HighlightService } from '~viewer/kaart/services/highlight.service';
import { OzonProvider } from '~providers/ozon.provider';
import * as fromHighlight from './highlight.reducer';
import { LoadingState } from '~model/loading-state.enum';
import { verbeeldingMock } from './highlight-mock';
import { annotatiesFeatureRootKey } from '~viewer/annotaties/+state';
import { bestemmingsplanFeaturesRootKey } from '~viewer/annotaties/+state/bestemminsplan-features/bestemmingsplan-features.reducer';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';

describe('HighlightEffects', () => {
  let spectator: SpectatorService<HighlightEffects>;
  let store$: MockStore<State>;
  let actions$: Observable<Action>;
  let ozonProvider: SpyObject<OzonProvider>;
  const spyOn_addHighlightLayerOzon = jasmine.createSpy('spyOn_addHighlightLayerOzon');
  const spyOn_addHighlightLayerIHR = jasmine.createSpy('spyOn_addHighlightLayerIHR');
  const spyOn_removeHighlightLayer = jasmine.createSpy('spyOn_removeHighlightLayer');

  const localIntialState = {
    ...initialState,
    [commonRootKey]: {
      [fromHighlight.featureKey]: {
        ids: ['id'],
        entities: {
          ['id']: {
            status: LoadingState.RESOLVED,
            entityId: 'id',
            data: {
              id: 'id',
              apiSource: ApiSource.OZON,
              type: '[Highlight] Loading Success',
              verbeelding: verbeeldingMock,
              locaties: ['locatieId'],
            },
          },
        },
        current: 'id',
        error: null,
      },
    },
    [annotatiesFeatureRootKey]: {
      [bestemmingsplanFeaturesRootKey]: {
        ids: ['id'],
        entities: {
          ['id']: {
            status: LoadingState.RESOLVED,
            entityId: 'id',
            data: {
              id: 'id',
              elementId: 'elementId',
              documentId: 'documentId',
              ihrLocatieIds: ['locatieId'],
            },
          },
        },
        error: null,
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: HighlightEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: localIntialState }),
      mockProvider(HighlightService, {
        addHighlightLayerOzon: spyOn_addHighlightLayerOzon,
        addHighlightLayerIHR: spyOn_addHighlightLayerIHR,
        removeHighlightLayer: spyOn_removeHighlightLayer,
      }),
    ],
    mocks: [OzonProvider],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    spyOn(store$, 'dispatch').and.stub();
    ozonProvider = spectator.inject(OzonProvider);
  });

  describe('load$', () => {
    it('should start loading', done => {
      actions$ = of(
        HighlightActions.load({
          id: 'newId',
          apiSource: ApiSource.OZON,
          selections: [
            {
              id: 'newId',
              apiSource: ApiSource.OZON,
              name: 'document',
              objectType: SelectionObjectType.REGELINGSGEBIED,
            },
          ],
        })
      );

      spectator.service.load$.subscribe(actual => {
        const expected = HighlightActions.loading({
          id: 'newId',
          apiSource: ApiSource.OZON,
          selections: [
            {
              id: 'newId',
              apiSource: ApiSource.OZON,
              name: 'document',
              objectType: SelectionObjectType.REGELINGSGEBIED,
            },
          ],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('show$', () => {
    it('should addHighlightLayerOzon', done => {
      actions$ = of(
        HighlightActions.loadingSuccess({
          id: 'id',
          apiSource: ApiSource.OZON,
          selections: [
            { id: 'id', apiSource: ApiSource.OZON, name: 'document', objectType: SelectionObjectType.REGELINGSGEBIED },
          ],
        })
      );

      spectator.service.show$.subscribe(() => {
        expect(spyOn_addHighlightLayerOzon).toHaveBeenCalledWith(verbeeldingMock, false);
        done();
      });
    });

    it('should addHighlightLayerIHR', done => {
      const selections: Selection[] = [
        {
          id: 'id',
          apiSource: ApiSource.IHR,
          name: 'NL.IMRO',
          documentDto: { documentId: 'NL.IMRO' },
          objectType: SelectionObjectType.REGELINGSGEBIED,
          locatieIds: ['NL.IMRO'],
        },
      ];

      actions$ = of(
        HighlightActions.loadingSuccess({
          id: 'id',
          apiSource: ApiSource.IHR,
          selections,
        })
      );

      spectator.service.show$.subscribe(() => {
        expect(spyOn_addHighlightLayerIHR).toHaveBeenCalledWith('NL.IMRO', ['NL.IMRO']);
        done();
      });
    });
  });

  describe('ozonLoading$', () => {
    it('should fetch verbeeldingen', done => {
      ozonProvider.fetchVerbeelding$.and.returnValue(of(verbeeldingMock));
      actions$ = of(
        HighlightActions.loading({
          id: 'id',
          apiSource: ApiSource.OZON,
          selections: [
            {
              id: 'id',
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.REGELINGSGEBIED,
              name: 'document',
            },
          ],
        })
      );

      spectator.service.ozonLoading$.subscribe(actual => {
        const expected = HighlightActions.loadingSuccess({
          id: 'id',
          apiSource: ApiSource.OZON,
          selections: [
            {
              id: 'id',
              apiSource: ApiSource.OZON,
              objectType: SelectionObjectType.REGELINGSGEBIED,
              name: 'document',
            },
          ],
          verbeelding: verbeeldingMock,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('ihrLoading$', () => {
    it('should getBestemmingsplanFeatures', done => {
      actions$ = of(
        HighlightActions.loading({
          id: 'id',
          apiSource: ApiSource.IHR,
          selections: [
            {
              id: 'id',
              apiSource: ApiSource.IHR,
              name: 'document',
              objectType: SelectionObjectType.REGELINGSGEBIED,
            },
          ],
        })
      );

      spectator.service.ihrLoading$.subscribe(actual => {
        const expected = HighlightActions.loadingSuccess({
          id: 'id',
          apiSource: ApiSource.IHR,
          selections: [
            {
              id: 'id',
              apiSource: ApiSource.IHR,
              name: 'document',
              objectType: SelectionObjectType.REGELINGSGEBIED,
            },
          ],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('cancel$', () => {
    it('should canec', done => {
      actions$ = of(HighlightActions.cancel());

      spectator.service.cancel$.subscribe(() => {
        expect(spyOn_removeHighlightLayer).toHaveBeenCalled();
        done();
      });
    });
  });
});
