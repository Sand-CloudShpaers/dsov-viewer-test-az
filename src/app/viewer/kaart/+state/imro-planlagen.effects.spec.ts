import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ImroPlanlagenEffects } from '~viewer/kaart/+state/imro-planlagen.effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { State } from '~store/common';
import { selectionMockStore } from '~store/common/selection/+state/selection-mock';
import * as SelectionActions from '~store/common/selection/+state/selection.actions';
import { LoadingState } from '~model/loading-state.enum';
import { documentFeatureRootKey } from '~viewer/documenten/+state';
import * as fromKaartenImro from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.reducer';
import * as MapDetailsActoins from '~viewer/documenten/+state/map-details/map-details.actions';
import { ApiSource } from '~model/internal/api-source';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import * as KaartenImroActions from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.actions';

describe('ImroPlanlagenEffects', () => {
  let spectator: SpectatorService<ImroPlanlagenEffects>;
  let store$: MockStore<State>;
  let actions$: Observable<Action>;
  const PLAN_ID = 'NL.IMRO.9925.SVOmgvisieGG-vst1';

  const selections: Selection[] = [
    {
      id: 'enkelbestemming',
      documentDto: {
        documentId: PLAN_ID,
      },
      apiSource: ApiSource.IHR,
      objectType: SelectionObjectType.BESTEMMINGSVLAK,
      name: 'bestemmingsvlak',
      symboolcode: 'symboolcode',
      locatieIds: ['enkelbestemming'],
    },
  ];

  const imroKaartStyleConfigs = [
    {
      id: 1,
      naam: PLAN_ID,
      style: {
        layers: [{}],
        name: 'Omgevingsvisie Gaaf Gelderland',
        sources: {
          plan: {
            tiles: ['tileUrl'],
            type: 'vector',
          },
        },
        sprite: 'spriteUrl',
        version: 8,
      },
    },
  ];
  const localInitialState = {
    ...selectionMockStore,
    [documentFeatureRootKey]: {
      [fromKaartenImro.kaartenImroFeatureKey]: {
        ids: [PLAN_ID],
        entities: {
          [PLAN_ID]: {
            status: LoadingState.RESOLVED,
            entityId: PLAN_ID,
            data: {
              bounds: '4.97346631466918,51.7330212977988,6.85053718841826,52.5139996127595',
              documentType: 'IMRO2012',
              id: PLAN_ID,
              naam: 'Omgevingsvisie Gaaf Gelderland',
              styles: imroKaartStyleConfigs,
              type: 'structuurvisie',
            },
          },
        },
      },
    },
  };

  const spyResetStyleWithSelections = jasmine.createSpy('spyResetStyleWithSelections');
  const spyOnResetSelections = jasmine.createSpy('spyOnResetSelections');

  const createService = createServiceFactory({
    service: ImroPlanlagenEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: localInitialState }),
      mockProvider(ImroPlanlagenService, {
        resetStyleWithSelections: spyResetStyleWithSelections,
        resetSelections: spyOnResetSelections,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    spyOn(store$, 'dispatch').and.stub();
  });

  describe('showOnMap$', () => {
    it('should call showSelectionWithStyle', done => {
      actions$ = of(SelectionActions.showSelectionsOnMap);
      spectator.service.showOnMap$.subscribe(actual => {
        const expected = KaartenImroActions.loadStyleConfigs({ documentIds: [] });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('showSelectionsWithStyle$', () => {
    it('should call bestemmingsplanlagenService.resetStyleWithSelections', done => {
      actions$ = of(KaartenImroActions.loadStylesSuccess);
      spectator.service.showSelectionsWithStyle$.subscribe(() => {
        expect(spyResetStyleWithSelections).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('showMapDetailsWithSelections$', () => {
    it('should call bestemmingsplanlagenService.resetStyleWithSelections in case BP', done => {
      actions$ = of(
        MapDetailsActoins.showMapDetails({
          documentId: PLAN_ID,
          selections,
        })
      );
      spectator.service.showMapDetailsWithSelections.subscribe(() => {
        expect(spyResetStyleWithSelections).toHaveBeenCalledWith(
          [
            {
              locatieIds: ['enkelbestemming'],
              documentId: 'NL.IMRO.9925.SVOmgvisieGG-vst1',
              symboolcode: 'symboolcode',
            },
          ],
          imroKaartStyleConfigs
        );
        done();
      });
    });
  });

  describe('resetMap$', () => {
    it('should call resetMap', done => {
      actions$ = of(SelectionActions.resetSelections);
      spectator.service.resetMap$.subscribe(() => {
        expect(spyOnResetSelections).toHaveBeenCalled();
        done();
      });
    });
  });
});
