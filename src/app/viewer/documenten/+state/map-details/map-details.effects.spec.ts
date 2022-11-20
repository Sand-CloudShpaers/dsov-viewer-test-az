import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { MapDetailsEffects } from './map-details.effects';
import { IhrProvider } from '~providers/ihr.provider';
import * as MapDetailsActions from './map-details.actions';
import { cartografieSummaryCollectieMock, featuresMock } from './map-details.mock';

describe('MapDetailsEffects', () => {
  let spectator: SpectatorService<MapDetailsEffects>;
  let actions$: Observable<Action>;
  let ihrProvider: SpyObject<IhrProvider>;

  const createService = createServiceFactory({
    service: MapDetailsEffects,
    providers: [provideMockActions(() => actions$)],
    mocks: [IhrProvider],
  });

  beforeEach(() => {
    spectator = createService();
    ihrProvider = spectator.inject(IhrProvider);
  });

  describe('load', () => {
    it('should return success with cartografie', done => {
      ihrProvider.fetchCartografieSummaries$.and.returnValue(of(cartografieSummaryCollectieMock));
      actions$ = of(MapDetailsActions.load({ documentId: 'documentId', features: featuresMock }));
      spectator.service.load$.subscribe(action => {
        expect(action).toEqual(
          MapDetailsActions.loadSuccess({
            documentId: 'documentId',
            cartografie: cartografieSummaryCollectieMock,
          })
        );
        done();
      });
    });
  });
});
