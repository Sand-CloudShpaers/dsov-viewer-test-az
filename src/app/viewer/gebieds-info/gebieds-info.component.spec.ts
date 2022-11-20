import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { GebiedsInfoComponent } from '~viewer/gebieds-info/gebieds-info.component';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { GebiedsInfoFacade } from '~viewer/gebieds-info/+state/gebieds-info.facade';
import { of } from 'rxjs';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SelectionSet } from './types/gebieds-info.model';
import { ContentService } from '~services/content.service';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { ApiSource } from '~model/internal/api-source';

describe('GebiedsInfoComponent', () => {
  let spectator: Spectator<GebiedsInfoComponent>;
  const spyOnResetSelections = jasmine.createSpy('spyOnResetSelections');
  const spyOnOpenGebiedenFilter = jasmine.createSpy('spyOnOpenGebiedenFilter');
  const spyOnRouteLocationNavigationPath = jasmine.createSpy('spyOnRouteLocationNavigationPath');

  const createComponent = createRoutingFactory({
    component: GebiedsInfoComponent,
    providers: [
      provideMockStore({ initialState }),
      SelectionFacade,
      mockProvider(SelectionFacade, {
        resetSelections: spyOnResetSelections,
      }),
      mockProvider(FilterFacade, {
        openGebiedenFilter: spyOnOpenGebiedenFilter,
      }),
      mockProvider(GebiedsInfoFacade),
      mockProvider(ContentService),
      mockProvider(FilteredResultsFacade),
      mockProvider(NavigationService, {
        routeLocationNavigationPath: spyOnRouteLocationNavigationPath,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show notification when pons is false', () => {
    expect(spectator.query('.gebiedsinfo__pons-alert')).toBeNull();

    spectator.component.omgevingsplanPons$ = of(false);
    spectator.detectChanges();

    expect(spectator.query('.gebiedsinfo__pons-alert').innerHTML).toContain('Op deze locatie gelden');
  });

  it('should show notification when isLargeArea is true', () => {
    const testId = '[data-test-id="omgevingsnormen__large-area-alert"]';

    expect(spectator.query(testId)).toBeNull();

    spectator.component.isLargeArea$ = of(true);
    spectator.component.omgevingsnormenStatus$ = of(derivedLoadingState(LoadingState.IDLE));
    spectator.detectChanges();

    expect(spectator.query(testId).innerHTML).toContain('Beperk het zoekgebied om Omgevingsnormen weer te geven');
  });

  it('should show "hints" when there is no selection', () => {
    spectator.component.viewSelectionStatus$ = of({
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: false,
      isRejected: false,
      isLoaded: false,
    });
    spectator.component.viewSelectionItems$ = of({
      omgevingsnormen: [],
      omgevingswaarden: [],
      gebiedsaanwijzingen: [],
    });
    spectator.component.activeSelection$ = of([]);
    spectator.detectChanges();

    expect(spectator.query('[data-test-id="gebiedsInfo__hints"]')).toBeVisible();
  });

  it('should call "regels op maat" when "bekijk selectie" is clicked', () => {
    const selection: SelectionSet = {
      naam: 'schaap',
      identificatie: 'parentId',
    };

    spectator.component.viewSelectionStatus$ = of({
      isLoading: false,
      isIdle: false,
      isPending: false,
      isResolved: false,
      isRejected: false,
      isLoaded: false,
    });
    spectator.component.activeSelection$ = of([
      {
        id: 'schaap',
        apiSource: ApiSource.OZON,
        parentId: 'parentId',
        objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
        symboolcode: 'vag123',
        name: 'mockje',
      },
    ]);
    spectator.component.viewSelectionItems$ = of({
      omgevingsnormen: [selection],
      omgevingswaarden: [],
      gebiedsaanwijzingen: [],
    });
    spectator.detectChanges();
    const button = spectator.query('[data-test-id="gebiedsInfo-bekijkSelectie__button"]');
    spectator.click(button);

    expect(spyOnOpenGebiedenFilter).toHaveBeenCalledWith([
      {
        id: 'parentId',
        name: 'schaap',
        objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
      },
    ]);
  });
});
