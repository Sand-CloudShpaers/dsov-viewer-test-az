import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TestStore } from '~mocks/test-store';
import { OverzichtComponent } from '~viewer/overzicht/overzicht.component';
import { mockProvider } from '@ngneat/spectator';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { of } from 'rxjs';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { FilterName } from '~viewer/filter/types/filter-options';

describe('OverzichtComponent', () => {
  let component: OverzichtComponent;
  let fixture: ComponentFixture<OverzichtComponent>;
  const spyOnResetSelections = jasmine.createSpy('spyOnRemoveSelections');
  const spyOn_resetFilters = jasmine.createSpy('spyOn_resetFilters');
  const spyOn_setFiltersFromQueryParams = jasmine.createSpy('spyOn_setFiltersFromQueryParams');

  describe('with LocatieID', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OverzichtComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                queryParams: {
                  [FilterName.REGELSBELEID]: 'regels',
                  [FilterName.LOCATIE]: 'dorpstraat 1',
                  [FilterName.DATUM]: '12-11-2022',
                },
                children: [
                  {
                    params: {},
                    routeConfig: {},
                  },
                ],
              },
            },
          },
          {
            provide: Router,
            useValue: {
              navigate: () => {},
            },
          },
          {
            provide: FilteredResultsFacade,
            useValue: {
              getIsDirty$: () => of(false),
            },
          },
          { provide: Store, useClass: TestStore },
          mockProvider(OzonLocatiesFacade),
          mockProvider(SelectionFacade, { resetSelections: spyOnResetSelections }),
          mockProvider(GegevenscatalogusProvider),
          mockProvider(FilterFacade, {
            resetFilters: spyOn_resetFilters,
            setFiltersFromQueryParams: spyOn_setFiltersFromQueryParams,
          }),
          mockProvider(KaartService),
          {
            provide: LocatieFilterService,
            useValue: {
              getEmptyLocationQueryParams: (): {
                [key: string]: null;
              } => ({
                'locatie-id': null,
                'locatie-x': null,
                'locatie-y': null,
                'locatie-stelsel': null,
                'locatie-perceel': null,
                'locatie-handmatig': null,
                'no-zoom': null,
              }),
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(OverzichtComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
      it('should reset', () => {
        component.ngOnInit();

        expect(spyOnResetSelections).toHaveBeenCalled();

        expect(spyOn_resetFilters).toHaveBeenCalledWith([
          FilterName.ACTIVITEIT,
          FilterName.DOCUMENTEN,
          FilterName.THEMA,
          FilterName.GEBIEDEN,
        ]);

        expect(spyOn_setFiltersFromQueryParams).toHaveBeenCalled();
      });
    });

    describe('ngOnDestroy', () => {
      it('should removeSelections', () => {
        component.ngOnDestroy();

        expect(spyOnResetSelections).toHaveBeenCalledWith(false);
      });
    });

    describe('previousPage', () => {
      it('should navigate to', () => {
        const router: Router = TestBed.inject(Router);
        const navigateSpy = spyOn(router, 'navigate');

        component.previousPage();

        expect(navigateSpy).toHaveBeenCalledWith(['viewer'], {
          queryParams: {
            locatie: null,
            'locatie-x': null,
            'locatie-y': null,
            'locatie-stelsel': null,
            'locatie-getekend-gebied': null,
            'no-zoom': null,
          },
          queryParamsHandling: 'merge',
        });
      });
    });

    describe('openPage', () => {
      let routeLocationNavigationPathSpy: jasmine.Spy;
      beforeEach(() => {
        const navigationService: NavigationService = TestBed.inject(NavigationService);
        routeLocationNavigationPathSpy = spyOn(navigationService, 'routeLocationNavigationPath');
      });

      it('should navigate to gebiedsinfo', () => {
        component.openPage(ViewerPage.GEBIEDEN);

        expect(routeLocationNavigationPathSpy).toHaveBeenCalledWith(ViewerPage.GEBIEDEN);
      });
    });
  });

  describe('with PerceelID', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OverzichtComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                children: [
                  {
                    params: {},
                    routeConfig: {},
                  },
                ],
              },
            },
          },
          {
            provide: Router,
            useValue: {
              navigate: () => {},
            },
          },
          {
            provide: FilteredResultsFacade,
            useValue: {
              getIsDirty$: () => of(false),
            },
          },
          { provide: Store, useClass: TestStore },
          mockProvider(OzonLocatiesFacade),
          mockProvider(SelectionFacade),
          mockProvider(GegevenscatalogusProvider),
          mockProvider(FilterFacade),
          mockProvider(LocatieFilterService),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(OverzichtComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    describe('setShowPlans (perceel)', () => {
      let store$: Store;
      let routeLocationNavigationPathSpy: jasmine.Spy;
      beforeEach(() => {
        const navigationService: NavigationService = TestBed.inject(NavigationService);
        routeLocationNavigationPathSpy = spyOn(navigationService, 'routeLocationNavigationPath');
        store$ = fixture.debugElement.injector.get(Store);
        spyOn(store$, 'dispatch').and.stub();
      });

      it('should dispatch 3 actions and navigate to documenten', () => {
        component.openPage(ViewerPage.DOCUMENTEN);

        expect(routeLocationNavigationPathSpy).toHaveBeenCalledWith(ViewerPage.DOCUMENTEN);
      });
    });
  });

  describe('with coordinates X and Y', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OverzichtComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                children: [
                  {
                    params: {},
                    routeConfig: {},
                  },
                ],
              },
            },
          },
          {
            provide: Router,
            useValue: {
              navigate: () => {},
            },
          },
          {
            provide: FilteredResultsFacade,
            useValue: {
              getIsDirty$: () => of(false),
            },
          },
          { provide: Store, useClass: TestStore },
          mockProvider(OzonLocatiesFacade),
          mockProvider(SelectionFacade),
          mockProvider(GegevenscatalogusProvider),
          mockProvider(FilterFacade),
          mockProvider(LocatieFilterService),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(OverzichtComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    describe('setShowPlans (coordinaten/x/y)', () => {
      let store$: Store;
      let routeLocationNavigationPathSpy: jasmine.Spy;
      beforeEach(() => {
        const navigationService: NavigationService = TestBed.inject(NavigationService);
        routeLocationNavigationPathSpy = spyOn(navigationService, 'routeLocationNavigationPath');
        store$ = fixture.debugElement.injector.get(Store);
        spyOn(store$, 'dispatch').and.stub();
      });

      it('should dispatch 3 actions and navigate to documenten', () => {
        component.openPage(ViewerPage.DOCUMENTEN);

        expect(routeLocationNavigationPathSpy).toHaveBeenCalledWith(ViewerPage.DOCUMENTEN);
      });
    });
  });

  describe('with "handmatig"', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OverzichtComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                children: [
                  {
                    params: {},
                    routeConfig: {},
                  },
                ],
              },
            },
          },
          {
            provide: Router,
            useValue: {
              navigate: () => {},
            },
          },
          {
            provide: FilteredResultsFacade,
            useValue: {
              getIsDirty$: () => of(false),
            },
          },
          { provide: Store, useClass: TestStore },
          mockProvider(OzonLocatiesFacade),
          mockProvider(SelectionFacade),
          mockProvider(GegevenscatalogusProvider),
          mockProvider(FilterFacade),
          mockProvider(LocatieFilterService),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(OverzichtComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    describe('setShowPlans (handmatig)', () => {
      let store$: Store;
      let routeLocationNavigationPathSpy: jasmine.Spy;
      beforeEach(() => {
        const navigationService: NavigationService = TestBed.inject(NavigationService);
        routeLocationNavigationPathSpy = spyOn(navigationService, 'routeLocationNavigationPath');
        store$ = fixture.debugElement.injector.get(Store);
        spyOn(store$, 'dispatch').and.stub();
      });

      it('should dispatch 3 actions and navigate to documenten', () => {
        component.openPage(ViewerPage.DOCUMENTEN);

        expect(routeLocationNavigationPathSpy).toHaveBeenCalledWith(ViewerPage.DOCUMENTEN);
      });
    });
  });
});
