import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { ApplicationPage } from '~store/common/navigation/types/application-page';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SearchPageComponent } from './search-page.component';
import { DrawSearchService } from '~viewer/search/services/draw-search.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { ActiviteitenFacade } from '~viewer/overzicht/activiteiten/+state/activiteiten.facade';
import { AnnotatiesFacade } from '~viewer/annotaties/+state/annotaties.facade';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { FilterName } from '~viewer/filter/types/filter-options';

describe('SearchPageComponent', () => {
  let spectator: Spectator<SearchPageComponent>;
  const spyOnResetFilters = jasmine.createSpy('spyOnResetFilters');
  const spyOnResetAllFilters = jasmine.createSpy('spyOnResetAllFilters');
  const spyOnSetFiltersFromQueryParams = jasmine.createSpy('spyOnSetFiltersFromQueryParams');
  const spyOnResetSelections = jasmine.createSpy('spyOn_removeSelections');
  const spyOnSetExtentToNL = jasmine.createSpy('spyOnSetExtentToNL');
  const spyOnEnableMapClick = jasmine.createSpy('spyOnEnableMapClick');
  const spyOnResetStateActiviteiten = jasmine.createSpy('spyOnResetStateActiviteiten');
  const spyOnResetStateAnnotaties = jasmine.createSpy('spyOnResetStateAnnotaties');
  const spyOnResetStateOzonLocaties = jasmine.createSpy('spyOnResetStateOzonLocaties');
  const spyOnResetStateFilteredResults = jasmine.createSpy('spyOnResetStateFilteredResults');

  const createComponent = createComponentFactory({
    component: SearchPageComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(FilterFacade, {
        resetFilters: spyOnResetFilters,
        resetAllFilters: spyOnResetAllFilters,
        setFiltersFromQueryParams: spyOnSetFiltersFromQueryParams,
      }),
      mockProvider(SelectionFacade, {
        resetSelections: spyOnResetSelections,
      }),
      mockProvider(DrawSearchService, {
        enableMapClick: spyOnEnableMapClick,
      }),
      mockProvider(KaartService, {
        setExtentToNL: spyOnSetExtentToNL,
      }),
      mockProvider(ActiviteitenFacade, {
        resetState: spyOnResetStateActiviteiten,
      }),
      mockProvider(AnnotatiesFacade, {
        resetState: spyOnResetStateAnnotaties,
      }),
      mockProvider(FilteredResultsFacade, {
        resetState: spyOnResetStateFilteredResults,
      }),
      mockProvider(OzonLocatiesFacade, {
        resetState: spyOnResetStateOzonLocaties,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  describe('ngOnInit', () => {
    it('should reset several states', () => {
      expect(spectator.component.timeTravel).toBeFalse();
      expect(spyOnSetExtentToNL).toHaveBeenCalled();
      expect(spyOnResetFilters).toHaveBeenCalledWith([FilterName.LOCATIE]);
      expect(spyOnEnableMapClick).toHaveBeenCalled();
      expect(spyOnResetSelections).toHaveBeenCalled();
      expect(spyOnResetStateAnnotaties).toHaveBeenCalled();
      expect(spyOnResetStateActiviteiten).toHaveBeenCalled();
      expect(spyOnResetStateFilteredResults).toHaveBeenCalled();
      expect(spyOnResetStateOzonLocaties).toHaveBeenCalled();
      expect(spyOnSetFiltersFromQueryParams).toHaveBeenCalled();
    });
  });

  describe('back', () => {
    it('should navigate to home', () => {
      spectator.component.back();

      expect(spyOnResetAllFilters).toHaveBeenCalledWith([ApplicationPage.HOME]);
    });
  });
});
