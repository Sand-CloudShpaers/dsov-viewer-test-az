import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { KaartenImroEffects } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { ImroPlanVtService } from '~viewer/documenten/services/imro-plan-vt.service';
import { imroPlanResponseMock } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.selectors.spec';
import { loadStyleConfigs, loadStyleConfigsSuccess } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.actions';

describe('KaartenImroEffects', () => {
  let spectator: SpectatorService<KaartenImroEffects>;
  let actions$: Observable<Action>;
  const id = 'testId';
  const spyOnGetImroPlan = jasmine.createSpy('spyOnGetImroPlan').and.returnValue(of(imroPlanResponseMock));

  const createService = createServiceFactory({
    service: KaartenImroEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState }),
      mockProvider(ImroPlanVtService, {
        getImroPlanStyleConfigs$: spyOnGetImroPlan,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should return loadStyleConfigsSuccess', done => {
    actions$ = of(loadStyleConfigs({ documentIds: [id] }));
    spectator.service.loadingStyleConfigs$.subscribe(actual => {
      const expected = loadStyleConfigsSuccess({
        configs: [imroPlanResponseMock],
      });

      expect(actual).toEqual(expected);
      done();
    });
  });
});
