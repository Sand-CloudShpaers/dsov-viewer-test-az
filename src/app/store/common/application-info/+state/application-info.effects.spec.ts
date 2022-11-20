import { fakeAsync, tick } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import initialState from '~mocks/initial-state';
import { commonRootKey, State } from '~store/common';
import { OzonProvider } from '~providers/ozon.provider';
import { ApplicationInfoEffects } from './application-info.effects';
import { IhrProvider } from '~providers/ihr.provider';
import * as ApplicationInfoActions from './application-info.actions';
import { featureKey } from './application-info.reducer';
import { resolvedState } from './application-info.reducer.spec';

describe('ApplicationInfoEffects', () => {
  let spectator: SpectatorService<ApplicationInfoEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let ozonProvider: SpyObject<OzonProvider>;
  let ihrProvider: SpyObject<IhrProvider>;

  const createService = createServiceFactory({
    service: ApplicationInfoEffects,
    imports: [],
    providers: [provideMockStore({ initialState }), provideMockActions(() => actions$)],
    mocks: [OzonProvider, IhrProvider],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    ozonProvider = spectator.inject(OzonProvider);
    ihrProvider = spectator.inject(IhrProvider);
  });

  describe('load', () => {
    it('should load', done => {
      actions$ = of(ApplicationInfoActions.load());

      spectator.service.load$.subscribe(actual => {
        const expected = ApplicationInfoActions.loading();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loading', () => {
    it('should start loading', done => {
      actions$ = of(ApplicationInfoActions.loading());

      ozonProvider.fetchPresenterenInfo$.and.returnValue(of(resolvedState.ozonPresenteren));
      ozonProvider.fetchVerbeeldenInfo$.and.returnValue(of(resolvedState.ozonVerbeelden));
      ihrProvider.fetchAppInfo$.and.returnValue(
        of({
          version: '4.0.0',
        })
      );

      spectator.service.loading$.subscribe(actual => {
        const expected = ApplicationInfoActions.loadSuccess({
          ozonPresenteren: resolvedState.ozonPresenteren,
          ozonVerbeelden: resolvedState.ozonVerbeelden,
          ihr: resolvedState.ihr,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('NOT load', () => {
    it('should NOT start loading', fakeAsync(() => {
      store$.setState({
        [commonRootKey]: {
          [featureKey]: resolvedState,
        },
      } as any);
      actions$ = of(ApplicationInfoActions.load());

      let result;
      spectator.service.load$.subscribe(actual => (result = actual));
      tick(jasmine.DEFAULT_TIMEOUT_INTERVAL);

      expect(result).toBeUndefined();
    }));
  });
});
