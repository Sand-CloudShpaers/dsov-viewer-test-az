import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationInfoNavigationService } from './location-info-navigation.service';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { Polygon } from 'ol/geom';

describe('LocationInfoNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LocationInfoNavigationService],
    });
  });

  describe('getQueryParamsForLocation', () => {
    it('should navigate with locatie', () => {
      const service = TestBed.inject(LocationInfoNavigationService);

      expect(service.getQueryParamsForLocation('straatnaam nummer postcode woonplaats')).toEqual({
        locatie: 'straatnaam nummer postcode woonplaats',
        'locatie-x': null,
        'locatie-y': null,
        'locatie-stelsel': null,
        'locatie-getekend-gebied': null,
        'no-zoom': null,
      });
    });
  });

  describe('getQueryParamsForCoordinates', () => {
    it('should return queryParamters for coordinates in RD', () => {
      const service = TestBed.inject(LocationInfoNavigationService);

      expect(
        service.getQueryParamsForCoordinates({
          coordinaten: {
            system: ZoekLocatieSystem.RD,
            [ZoekLocatieSystem.RD]: [10, 20],
          },
        })
      ).toEqual({
        'locatie-x': '10',
        'locatie-y': '20',
        'locatie-stelsel': 'RD',
        locatie: null,
        'locatie-getekend-gebied': null,
        'no-zoom': 'false',
      });
    });
  });

  describe('getQueryParamsForContour', () => {
    it('return queryParamters for getekend gebied', () => {
      const service = TestBed.inject(LocationInfoNavigationService);
      const geometry: Polygon = new Polygon([
        [
          [1.1236, 2.1234],
          [2, 3],
          [2, 1],
          [1.1236, 2.1234],
        ],
      ]);

      expect(service.getQueryParamsForContour(geometry)).toEqual({
        'locatie-x': null,
        'locatie-y': null,
        'locatie-stelsel': null,
        locatie: null,
        'locatie-getekend-gebied': 'POLYGON((1.1236 2.1234,2 3,2 1,1.1236 2.1234))',
        'no-zoom': null,
      });
    });
  });
});
