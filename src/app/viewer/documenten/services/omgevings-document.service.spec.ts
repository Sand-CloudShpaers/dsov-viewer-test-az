import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  createHttpFactory,
  createServiceFactory,
  HttpMethod,
  SpectatorHttp,
  SpectatorService,
} from '@ngneat/spectator';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { mockOzonDocumentStructuurElementen } from '~viewer/documenten/+state/document-structuur/document-structuur-ozon.mock';
import { createRegelingMock } from '~mocks/documenten.mock';
import { DocumentComponenten } from '~ozon-model/documentComponenten';
import { Kaarten } from '~ozon-model/kaarten';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService, OZON_PAGE_SIZE } from '~services/config.service';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';
import { ErrorHandlingService } from '~services/error-handling.service';
import { State } from '~store/state';
import * as fromKaartenMock from '../+state/kaarten/kaarten.mock';
import * as fromHoofdlijnenMock from '../+state/hoofdlijnen/hoofdlijnen.mock';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { OntwerpRegelteksten } from '~ozon-model/ontwerpRegelteksten';
import { OntwerpRegeltekstZoekParameter } from '~ozon-model/ontwerpRegeltekstZoekParameter';
import { OntwerpDivisieannotaties } from '~ozon-model/ontwerpDivisieannotaties';
import { ActivatedRoute } from '@angular/router';

describe('OmgevingsDocumentService', () => {
  let spectator: SpectatorHttp<OmgevingsDocumentService>;
  const createHttp = createHttpFactory({
    service: OmgevingsDocumentService,
    providers: [
      OzonHttpClient,
      ErrorHandlingService,
      {
        provide: ConfigService,
        useValue: {
          config: {
            ozon: {
              url: 'https://ozon.kadaster.nl',
              apiKey: 'een hele mooie key',
            },
          },
        },
      },
      provideMockStore({}),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
      },
    ],

    mocks: [ErrorHandler, DisplayErrorInfoMessagesService],
  });

  it('should create', () => {
    spectator = createHttp();

    expect(spectator.service).toBeTruthy();
  });

  describe('getRegeling$', () => {
    it('should send request to ozon findById with ozonOmgevingsVisieMock false', () => {
      spectator = createHttp();
      const id = 'lammetje';

      const successSpy = jasmine.createSpy('success');
      const failSpy = jasmine.createSpy('fail');
      spectator.service.getRegeling$(id, { geldigOp: '12-12-2020' }).subscribe({ next: successSpy, error: failSpy });

      // string based httptestingcontroller.expectOne can't handle params so created custom matcher, see https://github.com/angular/angular/issues/19974
      const findByIdUrl =
        'https://ozon.kadaster.nl/regelingen/lammetje?geldigOp=12-12-2020&inWerkingOp=12-12-2020&beschikbaarOp=12-12-2020T23%3A59%3A59Z';
      const ozonRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === findByIdUrl
      );
      const documentResponse = createRegelingMock();
      ozonRequest.flush(documentResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(documentResponse);
    });
  });

  describe('getOmgevingsVisieDocumentStructuur$', () => {
    it('should send request to ozon document structuur with ozonOmgevingsVisieMock false', () => {
      spectator = createHttp();

      const successSpy = jasmine.createSpy('success');
      const failSpy = jasmine.createSpy('fail');

      // string based httptestingcontroller.expectOne can't handle params so created custom matcher, see https://github.com/angular/angular/issues/19974
      const structuurUrl = encodeURI('https://geit.test/blaat/structuur?synchroniseerMetTileSet=normaal');

      spectator.service.get$<DocumentComponenten>(structuurUrl).subscribe({ next: successSpy, error: failSpy });

      const ozonRequest = spectator.controller.expectOne(
        req => req.method === HttpMethod.GET && req.urlWithParams === structuurUrl
      );

      const documentResponse = { _embedded: mockOzonDocumentStructuurElementen };
      ozonRequest.flush(documentResponse);

      expect(failSpy).not.toHaveBeenCalled();
      expect(successSpy).toHaveBeenCalledWith(documentResponse);
    });
  });
});

describe('OmgevingsDocumentService New', () => {
  let store$: Store<State>;
  let spectator: SpectatorService<OmgevingsDocumentService>;
  const httpOzonClientSpy = {
    requestOptions: () => null as unknown,
    post$: jasmine.createSpy('post$'),
  };

  const createService = createServiceFactory({
    service: OmgevingsDocumentService,
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
              apiKey: 'een hele mooie key',
            },
          },
          ozonMaxResponseSize: OZON_PAGE_SIZE,
        },
      },
      provideMockStore({}),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  describe('getKaarten$', () => {
    it('should return Observable of Kaarten', done => {
      const kaartenResponseMock: Kaarten = fromKaartenMock.mockKaartenResponse;
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(kaartenResponseMock));
      const kaartenResponse$: Observable<Kaarten> = spectator.service.getDocumentKaarten$([
        { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
      ]);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/kaarten/_zoek?page=0&size=200',
          {
            zoekParameters: [{ parameter: 'documentIdentificatie', zoekWaarden: ['id'] }],
          },
          null,
        ],
      ]);

      kaartenResponse$.subscribe(response => {
        expect(response).toEqual(kaartenResponseMock);
        done();
      });

      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('getDocumentHoofdlijnen$', () => {
    it('should return Observable of Hoofdlijnen', done => {
      const hoofdlijnenResponseMock: Hoofdlijnen = fromHoofdlijnenMock.mockHoofdlijnenResponse;
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(hoofdlijnenResponseMock));
      const hoofdlijnenRespsonse$: Observable<Hoofdlijnen> = spectator.service.getDocumentHoofdlijnen$([
        { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
      ]);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/hoofdlijnen/_zoek?page=0&size=200',
          {
            zoekParameters: [{ parameter: 'documentIdentificatie', zoekWaarden: ['id'] }],
          },
          null,
        ],
      ]);

      hoofdlijnenRespsonse$.subscribe(response => {
        expect(response).toEqual(hoofdlijnenResponseMock);
        done();
      });

      expect(store$.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('getOntwerpRegelteksten$', () => {
    it('should return Observable of Regelteksten', done => {
      const responseMock: OntwerpRegelteksten = {
        _embedded: {
          ontwerpRegelteksten: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(responseMock));
      const request$: Observable<OntwerpRegelteksten> = spectator.service.getOntwerpRegelteksten$([
        { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
        { parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId, zoekWaarden: ['id'] },
      ]);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/ontwerpregelteksten/_zoek?page=0&size=200&sort=volgordeNummer,asc',
          {
            zoekParameters: [
              { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
              {
                parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId,
                zoekWaarden: ['id'],
              },
            ],
          },
          null,
        ],
      ]);

      request$.subscribe(response => {
        expect(response).toEqual(responseMock);
        done();
      });
    });
  });

  describe('getOntwerpRegelteksten$, with empty location array', () => {
    it('should NOT return Observable of Regelteksten', done => {
      const request$: Observable<OntwerpRegelteksten> = spectator.service.getOntwerpRegelteksten$([
        { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
        { parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId, zoekWaarden: [] },
      ]);

      request$.subscribe(response => {
        expect(response).toEqual(null);
        done();
      });
    });
  });

  describe('getOntwerpDivisies$', () => {
    it('should return Observable of Divisies', done => {
      const responseMock: OntwerpDivisieannotaties = {
        _embedded: {
          ontwerpdivisieannotaties: [],
        },
        _links: { next: { href: '' } },
        page: null,
      };
      httpOzonClientSpy.post$.calls.reset();
      httpOzonClientSpy.post$.and.returnValue(of(responseMock));
      const request$: Observable<OntwerpDivisieannotaties> = spectator.service.getOntwerpDivisieannotaties$([
        { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
        { parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId, zoekWaarden: ['id'] },
      ]);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([
        [
          'https://ozon.kadaster.nl/ontwerpdivisieannotaties/_zoek?page=0&size=200&sort=volgordeNummer,asc',
          {
            zoekParameters: [
              { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
              {
                parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId,
                zoekWaarden: ['id'],
              },
            ],
          },
          null,
        ],
      ]);

      request$.subscribe(response => {
        expect(response).toEqual(responseMock);
        done();
      });
    });
  });

  describe('getOntwerpDivisieannotaties$, with empty location array', () => {
    it('should NOT return Observable of Divisieannotaties', done => {
      const request$: Observable<OntwerpDivisieannotaties> = spectator.service.getOntwerpDivisieannotaties$([
        { parameter: 'documentIdentificatie', zoekWaarden: ['id'] },
        { parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId, zoekWaarden: [] },
      ]);

      request$.subscribe(response => {
        expect(response).toEqual(null);
        done();
      });
    });
  });
});
