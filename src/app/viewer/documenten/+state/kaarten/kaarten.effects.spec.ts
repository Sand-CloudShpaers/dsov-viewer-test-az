import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { documentFeatureRootKey, State } from '~viewer/documenten/+state';
import { KaartZoekParameter } from '~ozon-model/kaartZoekParameter';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { KaartenEffects } from '~viewer/documenten/+state/kaarten/kaarten.effects';
import { mockKaartenResponse } from '~viewer/documenten/+state/kaarten/kaarten.mock';
import * as KaartenActions from './kaarten.actions';
import { kaartenFeatureKey } from './kaarten.reducer';
import { documentenFeatureKey } from '../documenten/documenten.reducer';
import { fakeAsync, tick } from '@angular/core/testing';

describe('KaartenEffects', () => {
  let spectator: SpectatorService<KaartenEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let omgevingsDocumentService: SpyObject<OmgevingsDocumentService>;
  const initialState = {
    [documentFeatureRootKey]: {
      [documentenFeatureKey]: {
        ids: [],
        entities: {},
        selectedDocumentId: null,
      },
      [kaartenFeatureKey]: {
        ids: [],
        entities: {},
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: KaartenEffects,
    providers: [
      provideMockStore({
        initialState,
      }),
      provideMockActions(() => actions$),
    ],
    mocks: [OmgevingsDocumentService],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    omgevingsDocumentService = spectator.inject(OmgevingsDocumentService);
  });

  describe('checkLoadKaarten', () => {
    it('should loadKaarten', done => {
      actions$ = of(KaartenActions.checkLoadKaarten({ documentId: 'testDocumentId' }));
      spectator.service.checkLoadKaarten$.subscribe(action => {
        expect(action).toEqual(
          KaartenActions.loadKaarten({
            zoekParameters: [{ parameter: 'documentIdentificatie', zoekWaarden: ['testDocumentId'] }],
            documentId: 'testDocumentId',
            kaarten: [],
          })
        );
        done();
      });
    });

    it('should not load kaarten when they are fully loaded', fakeAsync(() => {
      store$.setState({
        [documentFeatureRootKey]: {
          ...initialState[documentFeatureRootKey],
          [kaartenFeatureKey]: {
            ids: ['testDocumentId'],
            entities: {
              ['testDocumentId']: {
                data: [],
                entityId: 'testDocumentId',
                status: 'RESOLVED',
              },
            },
          },
        },
      } as any);
      actions$ = of(KaartenActions.checkLoadKaarten({ documentId: 'testDocumentId' }));
      spectator.service.checkLoadKaarten$.subscribe(action => {
        tick(jasmine.DEFAULT_TIMEOUT_INTERVAL);

        expect(action).toBeUndefined();
      });
    }));
  });

  describe('loadKaarten', () => {
    it('should handle successfull api response', done => {
      omgevingsDocumentService.getDocumentKaarten$.and.returnValue(of(mockKaartenResponse));
      actions$ = of(
        KaartenActions.loadKaarten({
          zoekParameters: [
            {
              parameter: KaartZoekParameter.ParameterEnum.DocumentIdentificatie,
              zoekWaarden: [''],
            },
          ],
          documentId: 'testDocumentId',
          kaarten: [],
        })
      );

      spectator.service.loadKaarten$.subscribe(actual => {
        const expected = KaartenActions.loadKaartenSuccess({
          documentId: 'testDocumentId',
          kaarten: mockKaartenResponse._embedded.kaarten,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle successfull api response, with load more', done => {
      omgevingsDocumentService.getDocumentKaarten$.and.returnValue(
        of({
          ...mockKaartenResponse,
          _links: {
            next: {
              href: 'href',
            },
          },
        })
      );

      actions$ = of(KaartenActions.loadKaarten({ zoekParameters: [], documentId: '', kaarten: [] }));

      spectator.service.loadKaarten$.subscribe(actual => {
        const expected = KaartenActions.loadKaarten({
          zoekParameters: [],
          documentId: '',
          kaarten: mockKaartenResponse._embedded.kaarten,
          href: 'href',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('stuk');
      omgevingsDocumentService.getDocumentKaarten$.and.returnValue(throwError(() => error));
      actions$ = of(
        KaartenActions.loadKaarten({
          zoekParameters: [
            {
              parameter: KaartZoekParameter.ParameterEnum.DocumentIdentificatie,
              zoekWaarden: [''],
            },
          ],
          documentId: 'testDocumentId',
          kaarten: [],
        })
      );

      spectator.service.loadKaarten$.subscribe(actual => {
        const expected = KaartenActions.loadKaartenFailure({ documentId: 'testDocumentId', error });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
