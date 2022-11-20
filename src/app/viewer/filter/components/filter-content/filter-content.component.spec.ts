import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { LocationType } from '~model/internal/active-location-type.model';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { initialFilterOptions } from '~viewer/filter/+state/filter.reducer';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterIdentification, FilterName, FilterOptions, LocatieFilter } from '~viewer/filter/types/filter-options';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { FilterContentComponent } from './filter-content.component';
import { ContentService } from '~services/content.service';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('FilterContentComponent', () => {
  let spectator: Spectator<FilterContentComponent>;
  const themaFilter = { thema: [{ id: 'themafiler', name: 'Thema Filter' }] };
  const locatieFilter: LocatieFilter = {
    id: 'adres',
    name: 'Adres',
    pdokId: '',
    source: LocationType.Adres,
    geometry: null,
  };
  const spyOnUpdateFilters = jasmine.createSpy('spyOnUpdateFilters');
  const spyOnNavigate = jasmine.createSpy('spyOnNavigate');

  const filterId: FilterIdentification = {
    id: 'id',
    name: 'name',
  };

  const createComponent = createComponentFactory({
    component: FilterContentComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(ContentService),
      mockProvider(FilterFacade, {
        updateFilters: spyOnUpdateFilters,
      }),
      mockProvider(GegevenscatalogusProvider),
      mockProvider(SearchFacade),
      mockProvider(Router, {
        navigate: spyOnNavigate,
      }),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParams: {},
          },
        },
      },
    ],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.selectedFilters = {};
    spectator.component.locatieFilter$ = of(locatieFilter);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('onFilterSelected', () => {
    spectator.component.onFilterSelected(themaFilter);

    expect(spectator.component.selectedFilters).toEqual(themaFilter);
  });

  describe('filterAcknowledged', () => {
    it('should set filters, with selected filters', () => {
      spectator.component.selectedFilters = themaFilter;
      spectator.component.filterAcknowledged(ViewerPage.THEMAS);

      expect(spyOnUpdateFilters).toHaveBeenCalledWith(themaFilter, ['viewer', 'themas']);
    });

    it('should set filters, with selected location', () => {
      spectator.component.selectedLocation = locatieFilter;
      spectator.component.filterAcknowledged();

      expect(spyOnUpdateFilters).toHaveBeenCalledWith({ [FilterName.LOCATIE]: [locatieFilter] }, []);
    });
  });

  describe('getFilterOptionsForName', () => {
    it('return filter options', () => {
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
        thema: [filterId],
        activiteit: [filterId],
      };

      expect(spectator.component.getFilterOptionsForName(filterOptions, FilterName.THEMA)).toEqual({
        ...initialFilterOptions,
        thema: filterOptions.thema,
      });

      expect(spectator.component.getFilterOptionsForName(filterOptions, null)).toEqual(initialFilterOptions);
    });
  });

  describe('confirm', () => {
    it('should confirm with location', () => {
      spyOn(spectator.component.confirmPanel, 'emit');
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
        gebieden: [{ ...filterId, id: 'id', objectType: SelectionObjectType.GEBIEDSAANWIJZING }],
        activiteit: [filterId],
      };

      spectator.component.confirm({ filters: filterOptions, name: FilterName.LOCATIE });

      expect(spectator.component.confirmPanel.emit).toHaveBeenCalledWith({
        name: FilterName.LOCATIE,
        page: undefined,
        title: 'Uw gekozen gebieden worden verwijderd',
        message: 'Als u uw locatie wijzigt worden uw gekozen gebieden verwijderd.',
        toBeDeletedFilter: FilterName.GEBIEDEN,
      });
    });

    it('should confirm with activiteit props', () => {
      spyOn(spectator.component.confirmPanel, 'emit');
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
        thema: [filterId],
      };
      spectator.component.confirm({
        filters: filterOptions,
        name: FilterName.ACTIVITEIT,
        page: ViewerPage.ACTIVITEITEN,
      });

      expect(spectator.component.confirmPanel.emit).toHaveBeenCalledWith({
        name: FilterName.ACTIVITEIT,
        title: "Uw gekozen thema's worden verwijderd",
        message:
          "U kunt niet tegelijkertijd zoeken op thema's en op activiteiten. Als u activiteiten gaat bekijken worden uw gekozen thema's verwijderd.",
        toBeDeletedFilter: FilterName.THEMA,
        page: ViewerPage.ACTIVITEITEN,
      });
    });

    it('should confirm with gebieden props', () => {
      spyOn(spectator.component.confirmPanel, 'emit');
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
        activiteit: [filterId],
      };
      spectator.component.confirm({ filters: filterOptions, name: FilterName.GEBIEDEN, page: ViewerPage.GEBIEDEN });

      expect(spectator.component.confirmPanel.emit).toHaveBeenCalledWith({
        name: FilterName.GEBIEDEN,
        page: ViewerPage.GEBIEDEN,
        title: 'Uw gekozen activiteiten worden verwijderd',
        message:
          'U kunt niet tegelijkertijd zoeken op activiteiten en op gebieden. Als u gebieden gaat bekijken worden uw gekozen activiteiten verwijderd.',
        toBeDeletedFilter: FilterName.ACTIVITEIT,
      });
    });

    it('should confirm with thema props', () => {
      spyOn(spectator.component.confirmPanel, 'emit');
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
        activiteit: [filterId],
        gebieden: [{ ...filterId, id: 'id', objectType: SelectionObjectType.GEBIEDSAANWIJZING }],
      };
      spectator.component.confirm({ filters: filterOptions, name: FilterName.THEMA, page: ViewerPage.THEMAS });

      expect(spectator.component.confirmPanel.emit).toHaveBeenCalledWith({
        name: FilterName.THEMA,
        title: 'Uw gekozen gebieden worden verwijderd',
        message:
          "U kunt niet tegelijkertijd zoeken op gebieden en op thema's. Als u thema's gaat bekijken worden uw gekozen gebieden verwijderd.",
        toBeDeletedFilter: FilterName.GEBIEDEN,
        page: ViewerPage.THEMAS,
      });
    });

    it('should confirm with documenten props', () => {
      spyOn(spectator.component.confirmPanel, 'emit');
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
        thema: [filterId],
      };
      spectator.component.confirm({ filters: filterOptions, name: FilterName.DOCUMENTEN, page: ViewerPage.DOCUMENTEN });

      expect(spectator.component.confirmPanel.emit).toHaveBeenCalledWith({
        name: FilterName.DOCUMENTEN,
        page: ViewerPage.DOCUMENTEN,
        title: "Uw gekozen thema's worden verwijderd",
        message: "Als u Alle documenten op uw locatie gaat bekijken worden uw gekozen thema's verwijderd.",
        toBeDeletedFilter: FilterName.THEMA,
      });
    });

    it('should not confirm', () => {
      spyOn(spectator.component.confirmPanel, 'emit');
      spectator.component.confirm({ filters: initialFilterOptions, name: FilterName.REGELSBELEID });

      expect(spectator.component.confirmPanel.emit).not.toHaveBeenCalled();
    });
  });

  describe('confirmed', () => {
    it('should clean filter items and navigatie, with activiteit', () => {
      const spyOnFilterAcknowledged = spyOn(spectator.component, 'filterAcknowledged');
      spectator.component.selectedFilters = {
        ...initialFilterOptions,
        thema: [filterId],
      };

      spectator.component.confirmed({
        name: FilterName.ACTIVITEIT,
        title: '',
        message: '',
        toBeDeletedFilter: FilterName.THEMA,
        page: ViewerPage.ACTIVITEITEN,
      });

      expect(spyOnFilterAcknowledged).toHaveBeenCalledWith(ViewerPage.ACTIVITEITEN);
    });

    it('should confirm with location, and proceed to confirmed', () => {
      const spyOnConfirmed = spyOn(spectator.component, 'confirmed');
      const filterOptions: FilterOptions = {
        ...initialFilterOptions,
      };

      spectator.component.confirm({ filters: filterOptions, name: FilterName.LOCATIE });

      expect(spyOnConfirmed).toHaveBeenCalledWith({
        name: FilterName.LOCATIE,
        page: undefined,
        title: null,
        message: null,
        toBeDeletedFilter: null,
      });
    });

    it('should clean filter items and navigatie, with gebiedsinfo', () => {
      const spyOnFilterAcknowledged = spyOn(spectator.component, 'filterAcknowledged');
      spectator.component.selectedFilters = {
        ...initialFilterOptions,
        activiteit: [filterId],
      };

      spectator.component.confirmed({
        name: FilterName.GEBIEDEN,
        title: '',
        message: '',
        toBeDeletedFilter: FilterName.ACTIVITEIT,
        page: ViewerPage.GEBIEDEN,
      });

      expect(spyOnFilterAcknowledged).toHaveBeenCalledWith(ViewerPage.GEBIEDEN);
    });
  });

  describe('canceled', () => {
    it('should reset location from store', () => {
      spectator.component.canceled(FilterName.LOCATIE);

      expect(spectator.component.selectedLocation).toEqual(null);
    });
  });

  describe('isTimeTravel', () => {
    it('should return correct value', () => {
      expect(spectator.component.isTimeTravel([{ timeTravelDate: '' } as FilterIdentification])).toBeTrue();
      expect(spectator.component.isTimeTravel([{} as FilterIdentification])).toBeFalse();
      expect(spectator.component.isTimeTravel([])).toBeFalse();
    });
  });
});
