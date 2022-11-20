import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import Point from 'ol/geom/Point';
import { of } from 'rxjs';
import { LOCATIE_ID_TYPE, PostBodyOzon } from '~general/utils/filter.utils';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService } from '~services/config.service';
import { OzonProvider } from './ozon.provider';
import { initialFilterOptions } from '~viewer/filter/+state/filter.reducer';
import { ActivatedRoute } from '@angular/router';
import { Polygon } from 'ol/geom';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { GeoJsonZoekobject } from '~ozon-model/geoJsonZoekobject';
import { HttpClient } from '@angular/common/http';

describe('OzonProvider', () => {
  let spectator: SpectatorService<OzonProvider>;
  const httpOzonClientSpy = {
    requestOptions: () => null as unknown,
    get$: jasmine.createSpy('get$'),
    post$: jasmine.createSpy('post$'),
  };
  const createProvider = createServiceFactory({
    service: OzonProvider,
    providers: [
      mockProvider(HttpClient),
      {
        provide: OzonHttpClient,
        useValue: httpOzonClientSpy,
      },
      {
        provide: ConfigService,
        useValue: {
          ozonMaxResponseSize: 999,
          config: {
            ozon: {
              url: 'https://ozon.kadaster.nl',
              apiKey: 'een ozon key',
            },
          },
        },
      },
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
    spectator = createProvider();
  });

  afterEach(async () => {
    httpOzonClientSpy.post$.calls.reset();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('constructGeoParameters', () => {
    it('should return undefined when no geometry is provided', () => {
      expect(
        OzonProvider.constructGeoParameters({
          id: 'location',
          name: 'location',
          geometry: null,
        })
      ).toBeNull();
    });

    it('should return a valid GeoJsonZoekObject', () => {
      const mockPolygon: Polygon = new Polygon([
        [
          [1.1236, 2.1234],
          [2, 3],
          [2, 1],
          [1.1236, 2.1234],
        ],
      ]);

      const mockPostbody = {
        geometrie: {
          type: 'Polygon',
          coordinates: [
            [
              [1.123, 2.123],
              [2, 3],
              [2, 1],
              [1.123, 2.123],
            ],
          ],
        } as GeoJSONGeometry,
        spatialOperator: GeoJsonZoekobject.SpatialOperatorEnum.Intersects,
      };

      expect(
        OzonProvider.constructGeoParameters({
          id: 'locatie',
          name: 'locatie',
          geometry: mockPolygon,
        })
      ).toEqual(mockPostbody);
    });
  });

  describe('fetchDocumentenByOzonLocaties$', () => {
    const ozonLocaties = ['l.a', 'l.b'];

    it('should call ozonClient', async () => {
      const expectedUrl = 'https://ozon.kadaster.nl/regelingen/tekstdelen/_zoek?page=0&size=999';
      const postBody: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: 'locatie.identificatie',
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };
      spectator.service.fetchRegelingen$(ozonLocaties, initialFilterOptions, '/regelingen/tekstdelen/_zoek');

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([[expectedUrl, postBody, null]]);
    });
  });

  describe('fetchDocumentenByUrl$', () => {
    const ozonLocaties = ['l.a', 'l.b'];

    it('should call ozonClient', async () => {
      const url = 'https://ozon.kadaster.nl/regelingen/_zoek?page=1&size=123';
      const expectedPostBody: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: 'locatie.identificatie',
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };

      spectator.service.fetchRegelingenByUrl$(url, ozonLocaties, initialFilterOptions);

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([[url, expectedPostBody, null]]);
    });
  });

  describe('fetchOntwerpRegelingenByUrl$', () => {
    const ozonLocaties = ['l.a', 'l.b'];

    it('should call ozonClient', async () => {
      const url = 'https://ozon.kadaster.nl/ontwerpregelingen/_zoek?page=1&size=123';
      const expectedPostBody: PostBodyOzon = {
        zoekParameters: [
          {
            parameter: 'ontwerplocatie.technischId',
            zoekWaarden: ['l.a', 'l.b'],
          },
        ],
      };

      spectator.service.fetchOntwerpRegelingenByUrl$(
        url,
        LOCATIE_ID_TYPE.OntwerplocatieTechnischId,
        ozonLocaties,
        initialFilterOptions
      );

      expect(httpOzonClientSpy.post$.calls.allArgs()).toEqual([[url, expectedPostBody, null]]);
    });
  });

  describe('fetchOzonLocatiesByGeo$', () => {
    it('should throw error when locatieidentificaties are not present', () => {
      httpOzonClientSpy.post$.and.returnValues(
        of({ _embedded: { omgevingsplanPons: false, locatieidentificaties: [] }, _links: null, page: null }),
        of({})
      );
      spectator.service
        .fetchOzonLocatiesByGeo$({ id: 'locatie', name: 'locatie', geometry: new Point([10000, 10000]) })
        .subscribe({
          error: error => expect(error).toEqual(new Error('Geen locatieidentificaties')), // eslint-disable-line
        });
    });

    it('should return response when locatieidentificaties are present', () => {
      httpOzonClientSpy.post$.and.returnValues(
        of({ _embedded: { omgevingsplanPons: false, locatieidentificaties: ['a'] }, _links: null, page: null }),
        of({})
      );
      spectator.service
        .fetchOzonLocatiesByGeo$({ id: 'locatie', name: 'locatie', geometry: new Point([10000, 10000]) })
        .subscribe({
          next: response =>
            // eslint-disable-line
            expect(response).toEqual([
              { _embedded: { omgevingsplanPons: false, locatieidentificaties: ['a'] }, _links: null, page: null },
              {} as any,
            ]),
        });
    });
  });
});
