import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import initialState from '~mocks/initial-state';
import { ErrorHandlingService } from '~services/error-handling.service';
import { SearchResultsComponent } from '~viewer/filtered-results/components/search-results/search-results.component';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { TestBed } from '@angular/core/testing';

describe('SearchResultsComponent', () => {
  let spectator: Spectator<SearchResultsComponent>;
  const spyOnRoute = jasmine.createSpy('route');

  const createComponent = createComponentFactory({
    component: SearchResultsComponent,
    imports: [HttpClientTestingModule, RouterTestingModule],
    providers: [
      mockProvider(FilterFacade),
      provideMockStore({ initialState }),
      mockProvider(ActivatedRoute, {
        snapshot: {
          queryParams: {},
          params: {},
        },
        children: [
          {
            snapshot: { url: [{ path: 'test' }] },
          },
        ],
      }),
      mockProvider(ErrorHandlingService),
      {
        provide: Router,
        useValue: {
          url: '/documenten?locatie=gem-abc',
          navigate: () => {},
        },
      },
      mockProvider(OzonLocatiesFacade),
      mockProvider(NavigationService, {
        routeLocationNavigationPath: spyOnRoute,
      }),
      mockProvider(KaartService),
      mockProvider(LocatieFilterService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(MockStore);
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('previousPage', () => {
    it('should navigate to provide url', () => {
      spectator.component.previousPage();

      expect(spyOnRoute).toHaveBeenCalledWith('overzicht');
    });

    it('should navigate to provide url when timetravelling', () => {
      const router = TestBed.inject(Router);
      const navigateSpy = spyOn(router, 'navigate').and.stub();
      spectator.component.timeTravel = true;
      spectator.component.previousPage();

      expect(navigateSpy).toHaveBeenCalledWith(['viewer'], {
        queryParams: { datum: '' },
        queryParamsHandling: 'merge',
      });
    });
  });
});
