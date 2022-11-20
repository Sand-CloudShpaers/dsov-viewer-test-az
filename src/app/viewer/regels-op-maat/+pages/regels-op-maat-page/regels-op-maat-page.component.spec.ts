import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RegelsOpMaatPageComponent } from './regels-op-maat-page.component';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { mockProvider } from '@ngneat/spectator';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { of } from 'rxjs';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { ViewerPage } from '~store/common/navigation/types/application-page';

describe('RegelsOpMaatPageComponent', () => {
  let component: RegelsOpMaatPageComponent;
  let fixture: ComponentFixture<RegelsOpMaatPageComponent>;
  const spyOnNavigate = jasmine.createSpy('spyOnNavigate');
  const spyOnCollapseAllElements = jasmine.createSpy('spyOnCollapseAllElements');
  const spyOnResetSelections = jasmine.createSpy('spyOnResetSelections');
  const navigationPaths: NavigationPaths = {
    [ViewerPage.OVERZICHT]: null,
    [ViewerPage.THEMAS]: null,
    [ViewerPage.GEBIEDEN]: null,
    [ViewerPage.ACTIVITEITEN]: null,
    [ViewerPage.DOCUMENTEN]: '/padNaarDocumenten',
    [ViewerPage.REGELSOPMAAT]: null,
    [ViewerPage.DOCUMENT]: null,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegelsOpMaatPageComponent],
      providers: [
        provideMockStore({ initialState }),
        mockProvider(DocumentenFacade, {
          collapseAllElements: spyOnCollapseAllElements,
        }),
        mockProvider(SelectionFacade, {
          resetSelections: spyOnResetSelections,
        }),
        mockProvider(NavigationFacade),
        mockProvider(Router, {
          navigate: spyOnNavigate,
        }),
        mockProvider(RegelsOpMaatFacade),
        mockProvider(OzonLocatiesFacade),
        mockProvider(FilterFacade),
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegelsOpMaatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ozonLocatiesStatus$ = of({
      isResolved: true,
      isLoading: false,
      isIdle: false,
      isPending: false,
      isRejected: false,
      isLoaded: false,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('back', () => {
    it('should navigate back to "overzicht"', () => {
      component.back(navigationPaths);

      expect(spyOnNavigate).toHaveBeenCalledWith([navigationPaths.documenten], { queryParamsHandling: 'preserve' });
    });

    it('should navigate back to "zoeken"', () => {
      component.back({ ...navigationPaths, documenten: null });

      expect(spyOnNavigate).toHaveBeenCalledWith(['viewer']);
    });

    it('should navigate back to "Gebieden met regels"', () => {
      component.back({ ...navigationPaths, documenten: null, gebieden: '/padNaarGebieden' });

      expect(spyOnNavigate).toHaveBeenCalledWith(['/padNaarGebieden'], { queryParamsHandling: 'preserve' });
    });
  });

  it('should resetSelections onDestroy', () => {
    component.ngOnDestroy();

    expect(spyOnResetSelections).toHaveBeenCalled();
  });
});
