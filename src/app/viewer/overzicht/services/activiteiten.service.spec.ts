import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import * as fromActiviteitenMock from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService, OZON_PAGE_SIZE } from '~services/config.service';
import { Activiteiten } from '~ozon-model/activiteiten';
import { ActiviteitenService } from '~viewer/overzicht/services/activiteiten.service';

describe('ActiviteitenService', () => {
  let spectator: SpectatorService<ActiviteitenService>;
  const httpOzonClientSpy = {
    requestOptions: () => null as unknown,
    post$: jasmine.createSpy('post$'),
  };

  const createService = createServiceFactory({
    service: ActiviteitenService,
    providers: [
      {
        provide: OzonHttpClient,
        useValue: httpOzonClientSpy,
      },
      {
        provide: ConfigService,
        useValue: {
          config: {
            ozon: {
              url: 'https://ozon.kadaster.nl',
              apiKey: 'een ozon key',
            },
          },
          ozonMaxResponseSize: OZON_PAGE_SIZE,
        },
      },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('getActiviteiten$', () => {
    it('should return Observable of ActiviteitenResponse on getActiviteiten$()', done => {
      const activiteitenResponseMock: Activiteiten = fromActiviteitenMock.mockActiviteitenResponse;
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(activiteitenResponseMock));
      const activiteitenResponse$: Observable<Activiteiten> = spectator.service.getActiviteiten$(['heelNederland']);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/activiteiten/_zoek?page=0&size=200',
          {
            zoekParameters: [{ parameter: 'locatie.identificatie', zoekWaarden: ['heelNederland'] }],
          },
          null,
        ],
      ]);
      activiteitenResponse$.subscribe(response => {
        expect(response).toEqual(activiteitenResponseMock);
        done();
      });
    });
  });
});
