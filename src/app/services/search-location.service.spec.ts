import { fakeAsync, tick } from '@angular/core/testing';
import { createHttpFactory, createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { FetchLocationInfoService } from '~viewer/kaart/services/fetch-location-info.service';
import { ConfigService } from '~services/config.service';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';
import { SearchLocationService } from './search-location.service';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('SearchLocationService New', () => {
  let spectator: SpectatorService<SearchLocationService>;
  const httpClientSpy = {
    post: jasmine.createSpy('post'),
  };
  const fetchLocationInfoServiceSpy = {
    fetchOpenbareLichamen$: jasmine.createSpy('fetchOpenbareLichamen$'),
  };

  const createService = createServiceFactory({
    service: SearchLocationService,
    providers: [
      {
        provide: HttpClient,
        useValue: httpClientSpy,
      },
      {
        provide: ConfigService,
        useValue: {
          config: {
            rdNapTrans: {
              url: 'url',
              apiKey: 'x',
            },
          },
        },
      },
      {
        provide: FetchLocationInfoService,
        useValue: fetchLocationInfoServiceSpy,
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('lookupRdNapTrans$', () => {
    it('should return RD-coordinates when inside the Netherlands', done => {
      httpClientSpy.post.and.returnValue(of({ data: { coordinates: [100000, 200000] } }));
      // binnen Nederland wordt altijd minimaal 1 openbaarlichaam geretourneerd
      fetchLocationInfoServiceSpy.fetchOpenbareLichamen$.and.returnValue(
        of([
          {
            bestuurslaag: 'rijk',
            code: 'rijk',
            naam: 'rijk',
            type: 'rijk',
          },
        ])
      );

      /* eslint-disable jasmine/new-line-before-expect */
      // ivm deze bug uitgezet: https://github.com/tlvince/eslint-plugin-jasmine/issues/324
      spectator.service.lookupRdNapTrans$([1.1, 2.2]).subscribe(response => expect(response).toEqual([100000, 200000]));
      /* eslint-enable */
      done();
    });

    it('should throw an Error when outside the Netherlands', () => {
      httpClientSpy.post.and.returnValue(of({ data: { coordinates: [100000, 200000] } }));
      // buiten Nederland is geen openbarelichamen
      fetchLocationInfoServiceSpy.fetchOpenbareLichamen$.and.returnValue(of([]));

      spectator.service.lookupRdNapTrans$([1.1, 2.2]).subscribe({
        /* eslint-disable jasmine/new-line-before-expect */
        // ivm deze bug uitgezet: https://github.com/tlvince/eslint-plugin-jasmine/issues/324
        error: error => expect(error).toEqual(new Error('Het zoekgebied bevindt zich buiten Nederland.')),
        /* eslint-enable */
      });
    });
  });
});

describe('SearchLocationService', () => {
  let fetchLocationInfoService: SpyObject<FetchLocationInfoService>;

  let spectator: SpectatorService<SearchLocationService>;
  const createService = createHttpFactory({
    service: SearchLocationService,
    providers: [ConfigService],
    mocks: [DisplayErrorInfoMessagesService, FetchLocationInfoService],
  });

  beforeEach(() => {
    spectator = createService();
    fetchLocationInfoService = spectator.inject(FetchLocationInfoService);
  });

  it('should call routine once ', fakeAsync(() => {
    const searchValue: number[] = [1, 2];
    fetchLocationInfoService.fetchOpenbareLichamen$.and.returnValue(
      of([
        {
          bestuurslaag: '',
          code: '',
          naam: '',
          type: '',
        },
      ])
    );
    spectator.service.validCoordinates$(searchValue);
    tick();

    expect(spectator.inject(FetchLocationInfoService).fetchOpenbareLichamen$.calls.count())
      .withContext('method should have been called')
      .toEqual(1);
  }));

  it('should return false when coordinates equals null', fakeAsync(() => {
    const searchValue: number[] = null;
    spectator.service.validCoordinates$(searchValue).subscribe(bool => {
      expect(bool).toEqual(false);
    });
  }));
});
