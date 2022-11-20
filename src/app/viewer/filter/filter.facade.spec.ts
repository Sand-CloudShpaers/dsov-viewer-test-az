import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import initialState from '~mocks/initial-state';
import { FilterFacade } from './filter.facade';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { FilterName, NamedFilter } from '~viewer/filter/types/filter-options';
import { State } from '~store/state';
import { ActiviteitVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { RegelsbeleidType } from '~model/regel-status.model';
import { LocationInfoNavigationService } from '~viewer/kaart/services/location-info-navigation.service';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { RouterTestingModule } from '@angular/router/testing';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { of } from 'rxjs';

describe('FilterFacade', () => {
  let spectator: SpectatorService<FilterFacade>;
  let store$: MockStore<State>;
  const themaFilter = { thema: [{ id: 'themafilter', name: 'Thema Filter' }] };

  const spyOnNotAllFiltersApply$ = jasmine.createSpy('spyOnShowFilteredResults');
  const spyOnGetQueryParamsForCoordinates = jasmine.createSpy('spyOnGetQueryParamsForCoordinates');
  const spyOnGetQueryParamsForLocation = jasmine.createSpy('spyOnGetQueryParamsForLocation');
  const spyOnNavigate = jasmine.createSpy('spyOnNavigate');
  const spyOn_resetState = jasmine.createSpy('spyOn_resetState');
  const spyOn_suggestLocation = jasmine.createSpy('spyOn_suggestLocation');

  const createService = createServiceFactory({
    service: FilterFacade,
    imports: [RouterTestingModule],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(NavigationService),
      mockProvider(NavigationFacade),
      mockProvider(FilteredResultsFacade, { notAllFiltersApply$: spyOnNotAllFiltersApply$ }),
      mockProvider(LocationInfoNavigationService, {
        getQueryParamsForCoordinates: spyOnGetQueryParamsForCoordinates,
        getQueryParamsForLocation: spyOnGetQueryParamsForLocation,
      }),
      {
        provide: LocatieFilterService,
        useValue: {
          resetState: spyOn_resetState,
          suggestLocation: spyOn_suggestLocation,
          searchSuggestions$: of([]),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
  });

  describe('setFilters', () => {
    it('should dispatch "[filter] Set Filters"', () => {
      spyOn(store$, 'dispatch').and.stub();
      spectator.service.updateFilters(themaFilter, []);

      expect(store$.dispatch).toHaveBeenCalledWith(
        FilterActions.UpdateFilters({ filterOptions: themaFilter, commands: [] })
      );
    });
  });

  describe('resetFilters', () => {
    beforeEach(() => spyOn(store$, 'dispatch').and.stub());

    it('should dispatch "[filter] Reset All Filters"', () => {
      spectator.service.resetAllFilters([]);

      expect(store$.dispatch).toHaveBeenCalledWith(FilterActions.ResetAllFilters({ commands: [] }));
    });

    it('should dispatch "[filter] Reset Filters"', () => {
      spectator.service.resetFilters([FilterName.ACTIVITEIT]);

      expect(store$.dispatch).toHaveBeenCalledWith(
        FilterActions.ResetFilters({ filterNames: [FilterName.ACTIVITEIT] })
      );
    });
  });

  describe('removeFilter', () => {
    beforeEach(() => {
      spyOn(store$, 'dispatch').and.stub();
      spyOnNavigate.calls.reset();
    });

    it('should dispatch "[filter] Remove Filter" without update queryParams', () => {
      const namedFilter: NamedFilter = { name: FilterName.THEMA, filter: { id: 'themafilter', name: 'Thema Filter' } };
      spectator.service.removeFilter(namedFilter);

      expect(store$.dispatch).toHaveBeenCalledWith(FilterActions.RemoveFilter({ namedFilter }));
    });

    it('should dispatch "[filter] Remove Filter" and remove value from queryParam regelsbeleid', () => {
      const namedFilter: NamedFilter = { name: FilterName.REGELSBELEID, filter: RegelsbeleidType.regels };
      spectator.service.removeFilter(namedFilter);

      expect(store$.dispatch).toHaveBeenCalledWith(FilterActions.RemoveFilter({ namedFilter }));
    });

    it('should dispatch "[filter] Remove Filter" and remove queryParam regelsbeleid when none is selected', () => {
      const namedFilter: NamedFilter = { name: FilterName.REGELSBELEID, filter: RegelsbeleidType.regels };
      spectator.service.removeFilter(namedFilter);

      expect(store$.dispatch).toHaveBeenCalledWith(FilterActions.RemoveFilter({ namedFilter }));
    });
  });

  describe('openThemaFilter', () => {
    it('should dispatch "[filter] Set Filters" and call showFilteredResults', () => {
      spyOn(store$, 'dispatch').and.stub();
      spectator.service.openThemaFilter({ id: 'themafilter', name: 'Thema Filter' });

      expect(store$.dispatch).toHaveBeenCalledWith(
        FilterActions.UpdateFilters({ filterOptions: themaFilter, commands: ['viewer/documenten'] })
      );
    });
  });

  describe('openActiviteitFilter', () => {
    it('should dispatch "[filter] Set Filters" and call openRegelsOpMaat', () => {
      spyOn(store$, 'dispatch').and.stub();
      const activiteit: ActiviteitVM = { identificatie: 'activiteit', naam: 'ActiviteitFilter' };
      const activiteitFilter = { id: activiteit.identificatie, name: activiteit.naam };
      spectator.service.openActiviteitFilter([activiteit]);

      expect(store$.dispatch).toHaveBeenCalledWith(
        FilterActions.UpdateFilters({
          filterOptions: { activiteit: [activiteitFilter] },
          commands: ['viewer/regelsopmaat'],
        })
      );
    });
  });
});
