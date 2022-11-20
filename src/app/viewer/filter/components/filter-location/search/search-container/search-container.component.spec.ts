import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { SearchContainerComponent } from '~viewer/filter/components/filter-location/search/search-container/search-container.component';
import { DrawSearchService } from '~viewer/search/services/draw-search.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SearchMode } from '~viewer/search/types/search-mode';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { LocationType } from '~model/internal/active-location-type.model';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';

describe('SearchContainerComponent', () => {
  let spectator: Spectator<SearchContainerComponent>;

  const spyOnUpdateFilters = jasmine.createSpy('spyOnOpenSuggestion');

  const createComponent = createComponentFactory({
    component: SearchContainerComponent,
    imports: [RouterTestingModule],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(SelectionFacade),
      mockProvider(FilterFacade, {
        updateFilters: spyOnUpdateFilters,
      }),
      mockProvider(SearchFacade),
    ],
    mocks: [DrawSearchService, KaartService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('changelocation', () => {
    it('should updateFilters', () => {
      const activeLocation: LocatieFilter = {
        id: 'adres',
        name: 'Adres',
        pdokId: '',
        source: LocationType.Adres,
        geometry: null,
      };
      spectator.component.changeLocatieFilter(activeLocation);

      expect(spyOnUpdateFilters).toHaveBeenCalledWith({ [FilterName.LOCATIE]: [activeLocation] }, [
        `${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`,
      ]);
    });
  });

  describe('set the search title', () => {
    it('should print "Zoek Locatie"', () => {
      const title = spectator.component.getTitle(SearchMode.LOCATIE);

      expect(title).toEqual('Zoek locatie');
    });

    it('should print "Zoek coördinaten"', () => {
      const title = spectator.component.getTitle(SearchMode.COORDINATEN);

      expect(title).toEqual('Zoek coördinaten');
    });

    it('should print "Zoek Document"', () => {
      const title = spectator.component.getTitle(SearchMode.DOCUMENT);

      expect(title).toEqual('Zoek document');
    });

    it('should print "Zoek Gebied op de kaart"', () => {
      const title = spectator.component.getTitle(SearchMode.GEBIEDOPDEKAART);

      expect(title).toEqual('Zoek gebied');
    });
  });
});
