import { HttpClient } from '@angular/common/http';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { of } from 'rxjs';
import { ConfigService } from '~services/config.service';
import { FetchLocationInfoService } from './fetch-location-info.service';
import { PdokService } from '~viewer/search/services/pdok-service';

describe('FetchLocationInfoService', () => {
  let spectator: SpectatorService<FetchLocationInfoService>;
  let pdokService: SpyObject<PdokService>;
  let httpClient: SpyObject<HttpClient>;

  const configServiceValue = {
    config: {
      pdok: {
        url: 'url-pdok&',
      },
      bestuurlijkeGrenzen: {
        url: 'https://brk.basisregistraties.overheid.nl/api/bestuurlijke-grenzen/v2',
        apiKey: 'apiKey',
      },
    },
  };

  const createService = createServiceFactory({
    service: FetchLocationInfoService,
    providers: [
      {
        provide: ConfigService,
        useValue: configServiceValue,
      },
    ],
    mocks: [PdokService, HttpClient],
  });

  const mockResponselocaties$ = of({
    response: {
      numFound: 1,
      start: 0,
      maxScore: 1,
      docs: [
        {
          type: 'adres',
          weergavenaam: 'blubber3, 2300AA Potjesdam',
          id: '456',
          score: 1,
          afstand: 10,
        },
        {
          type: 'perceel',
          weergavenaam: 'Perceel Aalst Gelderland (AAL02) A 1447',
          id: '123',
          score: 1,
          afstand: 10,
        },
        {
          type: 'gemeente',
          weergavenaam: 'Gemeente Potjesdam',
          id: '000',
          score: 1,
          afstand: 0,
        },
      ],
    },
  });

  beforeEach(() => {
    spectator = createService();
    pdokService = spectator.inject(PdokService);
    httpClient = spectator.inject(HttpClient);
  });

  describe('is NOT ContinentaalPlat', () => {
    it('should call BRK API and get 0 openbaarLichaam for continentaal plat coördinates', async () => {
      httpClient.post.and.returnValue(
        of({
          _embedded: {
            openbareLichamen: [],
          },
        })
      );
      spectator.service.fetchOpenbareLichamen$([91398, 573357]).subscribe(response => {
        expect(response).toEqual([]);
      });
    });
  });

  describe('is ContinentaalPlat', () => {
    it('should call BRK API and get 1 openbaarLichaam for continentaal plat coördinates', async () => {
      httpClient.post.and.returnValue(
        of({
          _embedded: {
            openbareLichamen: [
              {
                bestuurslaag: 'rijk',
                code: 'LND6030',
                naam: 'Nederland',
                type: 'Rijk',
              },
            ],
          },
        })
      );
      spectator.service.fetchOpenbareLichamen$([91398, 573357]).subscribe(response => {
        expect(response).toEqual([
          {
            bestuurslaag: 'rijk',
            code: 'LND6030',
            naam: 'Nederland',
            type: 'Rijk',
          },
        ]);
      });
    });
  });

  describe('set coordinates outside Municipality', () => {
    it('locationInfo should not have municipality', async () => {
      httpClient.post.and.returnValue(
        of({
          _embedded: {
            openbareLichamen: [
              {
                bestuurslaag: 'rijk',
                code: 'LND6030',
                naam: 'Nederland',
                type: 'Rijk',
              },
            ],
          },
        })
      );
      spectator.service.getZoekLocatieInfo$([30286, 395774]).subscribe(locationInfo => {
        if (locationInfo) {
          expect(locationInfo.gemeente).toBeUndefined();
        }
      });
    });
  });

  describe('set coordinates inside Municipality and fetch locatieInfo', () => {
    it('locationInfo should have gemeente, perceel and adres', async () => {
      httpClient.post.and.returnValue(
        of({
          _embedded: {
            openbareLichamen: [
              {
                bestuurslaag: 'gemeente',
                code: '000',
                naam: 'Gemeente Potjesdam',
                type: 'Gemeente',
              },
            ],
          },
        })
      );
      pdokService.getLocatiesByPoint$.and.returnValue(mockResponselocaties$);
      pdokService.lookupLocation$.and.returnValue(
        of({
          maxScore: 15.754361,
          numFound: 1,
          start: 0,
          docs: [
            {
              bron: 'BAG',
              centroide_ll: '',
              centroide_rd: '',
              gemeentecode: '',
              gemeentenaam: '',
              geometrie_ll: '',
              geometrie_rd: '',
              id: '',
              identificatie: '',
              provincieafkorting: 'GD',
              provinciecode: 'PV25',
              provincienaam: 'Gelderland',
              shard: 'bag',
              sortering: 40,
              suggest: [''],
              type: 'adres',
              typesortering: 4,
              weergavenaam: 'blubber3, 2300AA Potjesdam',
              woonplaatscode: '',
              woonplaatsnaam: '',
              _version_: 1,
              gekoppeld_perceel: ['AAL02-A-1498', 'AAL02-A-1448', 'AAL02-A-1447', 'AAL02-A-1596'],
            },
          ],
        })
      );
      spectator.service.getZoekLocatieInfo$([30286, 395774]).subscribe(locationInfo => {
        expect(locationInfo.gemeente.weergavenaam).toEqual('Gemeente Potjesdam');
        expect(locationInfo.perceel.weergavenaam).toEqual('Perceel Aalst Gelderland (AAL02) A 1447');
        expect(locationInfo.adres.weergavenaam).toEqual('blubber3, 2300AA Potjesdam');
      });
    });
  });
});
