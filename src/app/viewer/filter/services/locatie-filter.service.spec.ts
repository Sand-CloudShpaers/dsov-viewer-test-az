import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { LocatieFilterService } from '../../filter/services/locatie-filter.service';
import { of } from 'rxjs';
import { SearchLocationService } from '~services/search-location.service';
import { Router } from '@angular/router';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { mockProvider } from '@ngneat/spectator';
import { SuggestDoc } from '~model/georegister/suggest.model';
import { LocationType } from '~model/internal/active-location-type.model';
import { PdokService } from '~viewer/search/services/pdok-service';

const mockSuggest: SuggestDoc = {
  type: LocationType.Adres,
  id: 'test',
  weergavenaam: 'adres',
};

describe('LocatieFilterService', () => {
  let service: LocatieFilterService;

  const spyOnClick = jasmine.createSpy('spyOnClick').and.returnValue(of(''));
  const spyOnDispatch = jasmine.createSpy('spyOnDispatch');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        LocatieFilterService,
        mockProvider(IhrDocumentService),
        {
          provide: Store,
          useValue: { dispatch: spyOnDispatch },
        },
        {
          provide: OmgevingsDocumentService,
          useValue: { getRegeling$: (identificatie: string) => of({ identificatie }) },
        },
        {
          provide: PdokService,
          useValue: {
            suggestLocations$: (query: string) => {
              if (query === 'fq=type:(adres OR perceel)&q=test1') {
                return of(['suggestion']);
              }
              return of([]);
            },
          },
        },
        {
          provide: SearchLocationService,
          useValue: {
            validCoordinates$: () => of(true),
            checkCoordinates$: (coordinates: number[]) => of(coordinates),
            lookupLocationIdAndShowOnMap$: spyOnClick,
          },
        },
      ],
    });
    service = TestBed.inject(LocatieFilterService);
  });

  it('should exist', () => {
    expect(service).toBeTruthy();
  });

  describe('suggestLocation', () => {
    it('suggestLocation success', done => {
      service.suggestLocation('test1');
      service.searchSuggestions$.subscribe(result => {
        expect(result).toEqual(['suggestion' as any]);
        done();
      });
    });

    it('suggestLocation no results', done => {
      service.suggestLocation('test2');
      service.searchStatus$.subscribe(result => {
        expect(result.error).toEqual('test2 niet gevonden in Nederland.');
        done();
      });
    });
  });

  describe('openSuggestion', () => {
    it('openSuggestion', () => {
      const router: Router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');

      service.openSuggestion(['viewer/overzicht'], mockSuggest.weergavenaam);

      expect(navigateSpy).toHaveBeenCalledWith(['viewer/overzicht'], {
        queryParams: {
          'locatie-x': null,
          'locatie-y': null,
          'locatie-stelsel': null,
          locatie: 'adres',
          'locatie-getekend-gebied': null,
          'no-zoom': null,
          datum: null,
          geldigOp: null,
          inWerkingOp: null,
          beschikbaarOp: null,
        },
        queryParamsHandling: 'merge',
      });
    });

    it('openSuggestion with date', () => {
      const router: Router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate');

      service.openSuggestion(['viewer/overzicht'], mockSuggest.weergavenaam, '2022-01-02');

      expect(navigateSpy).toHaveBeenCalledWith(['viewer/overzicht'], {
        queryParams: {
          'locatie-x': null,
          'locatie-y': null,
          'locatie-stelsel': null,
          locatie: 'adres',
          'locatie-getekend-gebied': null,
          'no-zoom': null,
          datum: '2022-01-02',
          geldigOp: null,
          inWerkingOp: null,
          beschikbaarOp: null,
        },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('isValidInput', () => {
    it('should validate input', () => {
      expect(service.isValidInput('test')).toBeTrue();
      expect(service.isValidInput('<test>,')).toBeFalse();
    });
  });

  describe('getParsedCoordinates', () => {
    it('should get parsed coordinates in RD', () => {
      // getParsedCoordinates returns theoretically valid pairs, not necessarily valid points in NL
      expect(service.getParsedCoordinates('test', true)).toBeNull();
      expect(service.getParsedCoordinates('', true)).toBeNull();
      expect(service.getParsedCoordinates('1,2', true)).toBeNull();
      expect(service.getParsedCoordinates('a,b', true)).toBeNull();

      expect(service.getParsedCoordinates('155000,463000', true)).toEqual([155000, 463000]);
      expect(service.getParsedCoordinates(' 155000 , 463000 ', true)).toEqual([155000, 463000]);
      expect(service.getParsedCoordinates('155.000, 463.000', true)).toBeNull();
      expect(service.getParsedCoordinates('155 000, 463 000', true)).toBeNull();

      expect(service.getParsedCoordinates('51928,359232', true)).toEqual([51928, 359232]);
      expect(service.getParsedCoordinates('51928,35923', true)).toBeNull();
      expect(service.getParsedCoordinates('519280,35923', true)).toBeNull();

      expect(service.getParsedCoordinates('123456,567890', true)).toEqual([123456, 567890]);
      expect(service.getParsedCoordinates('999999,999999', true)).toEqual([999999, 999999]);
    });

    it('should get parsed coordinates in ETRS', () => {
      expect(service.getParsedCoordinates('test', false)).toBeNull();
      expect(service.getParsedCoordinates('', false)).toBeNull();
      expect(service.getParsedCoordinates('a,b', false)).toBeNull();

      expect(service.getParsedCoordinates('1,2', false)).toEqual([1, 2]);
      expect(service.getParsedCoordinates('52.243333, 5.634167', false)).toEqual([52.243333, 5.634167]);
      expect(service.getParsedCoordinates(' 52.243333, 5.634167 ', false)).toEqual([52.243333, 5.634167]);
      expect(service.getParsedCoordinates(' 52.243333  , 5.634167 ', false)).toEqual([52.243333, 5.634167]);
      expect(service.getParsedCoordinates(' 52.243333  , 5.634167 ', false)).toEqual([52.243333, 5.634167]);

      expect(service.getParsedCoordinates('52,243333; 5,634167', false)).toEqual([52.243333, 5.634167]);
      expect(service.getParsedCoordinates('52.243333; 5.634167', false)).toEqual([52.243333, 5.634167]);

      expect(service.getParsedCoordinates('52,243333, 5,634167,', false)).toBeNull();
      expect(service.getParsedCoordinates('52;243333; 5;634167', false)).toBeNull();
      expect(service.getParsedCoordinates('52.243333, 5.634167, 1', false)).toBeNull();
    });
  });
});
