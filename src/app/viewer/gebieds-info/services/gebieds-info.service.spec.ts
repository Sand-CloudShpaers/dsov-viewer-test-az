import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import * as fromGebiedsaanwijzingenMock from '~viewer/gebieds-info/+state/gebiedsaanwijzingen/gebiedsaanwijzingen.mock';
import * as fromOmgevingswaardenMock from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.mock';
import * as fromOmgevingsnormenMock from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.mock';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService, OZON_PAGE_SIZE } from '~services/config.service';
import { Gebiedsaanwijzingen } from '~ozon-model/gebiedsaanwijzingen';
import { Omgevingswaarden } from '~ozon-model/omgevingswaarden';
import { Omgevingsnormen } from '~ozon-model/omgevingsnormen';

describe('GebiedsInfoService', () => {
  let spectator: SpectatorService<GebiedsInfoService>;
  const httpOzonClientSpy = {
    requestOptions: () => null as unknown,
    post$: jasmine.createSpy('post$'),
  };

  const createService = createServiceFactory({
    service: GebiedsInfoService,
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

  describe('getGebiedsaanwijzingen$', () => {
    it('should return Observable of GebiedsaanwijzingenResponse on getGebiedsaanwijzingen$()', done => {
      const gebiedsaanwijzingenResponseMock: Gebiedsaanwijzingen =
        fromGebiedsaanwijzingenMock.mockGebiedsaanwijzingenResponse;
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(gebiedsaanwijzingenResponseMock));
      const gebiedsaanwijzingenResponse$: Observable<Gebiedsaanwijzingen> = spectator.service.getGebiedsaanwijzingen$([
        'ergens',
      ]);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/gebiedsaanwijzingen/_zoek?page=0&size=200',
          {
            zoekParameters: [{ parameter: 'locatie.identificatie', zoekWaarden: ['ergens'] }],
          },
          null,
        ],
      ]);

      gebiedsaanwijzingenResponse$.subscribe(response => {
        expect(response).toEqual(gebiedsaanwijzingenResponseMock);
        done();
      });
    });
  });

  describe('getOmgevingswaarden$', () => {
    it('should return Observable of Omgevingswaarden on getOmgevingswaarden$()', done => {
      const omgevingswaardenResponseMock: Omgevingswaarden = fromOmgevingswaardenMock.mockOmgevingswaardenResponse;
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(omgevingswaardenResponseMock));
      const omgevingswaardenResponse$: Observable<Omgevingswaarden> = spectator.service.getOmgevingswaarden$(['daar']);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/omgevingswaarden/_zoek?page=0&size=200',
          {
            zoekParameters: [{ parameter: 'locatie.identificatie', zoekWaarden: ['daar'] }],
          },
          null,
        ],
      ]);

      omgevingswaardenResponse$.subscribe(response => {
        expect(response).toEqual(omgevingswaardenResponseMock);
        done();
      });
    });
  });

  describe('getOmgevingsnormen$', () => {
    it('should return Observable of Omgevingsnormen', done => {
      const omgevingsnormenResponseMock: Omgevingsnormen = fromOmgevingsnormenMock.mockOmgevingsnormenResponse;
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(omgevingsnormenResponseMock));
      const omgevingsnormenResponse$: Observable<Omgevingsnormen> = spectator.service.getOmgevingsnormen$(['hier']);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/omgevingsnormen/_zoek?page=0&size=200&_expand=true&_expandScope=locaties',
          {
            zoekParameters: [{ parameter: 'locatie.identificatie', zoekWaarden: ['hier'] }],
          },
          null,
        ],
      ]);

      omgevingsnormenResponse$.subscribe(response => {
        expect(response).toEqual(omgevingsnormenResponseMock);
        done();
      });
    });
  });
});
