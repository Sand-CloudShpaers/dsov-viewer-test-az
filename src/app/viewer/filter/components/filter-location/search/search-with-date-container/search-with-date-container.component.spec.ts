import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DrawSearchService } from '~viewer/search/services/draw-search.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LocationType } from '~model/internal/active-location-type.model';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { SearchWithDateContainerComponent } from './search-with-date-container.component';
import { DatePickerDetail } from '~viewer/components/date-picker-container/date-picker-container.component';
import { SearchMode } from '~viewer/search/types/search-mode';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { ConfigService } from '~services/config.service';

describe('SearchWithDateContainerComponent', () => {
  let spectator: Spectator<SearchWithDateContainerComponent>;
  const spyOnToggleInteractions = jasmine.createSpy('spyOnToggleInteractions');
  const spyOnOpenUpdateFilters = jasmine.createSpy('spyOnOpenUpdateFilters');
  const spyOnSetTimeTravelDate = jasmine.createSpy('spyOnSetTimeTravelDate');

  const createComponent = createComponentFactory({
    component: SearchWithDateContainerComponent,
    imports: [RouterTestingModule],
    providers: [
      mockProvider(SearchFacade),
      mockProvider(FilterFacade, {
        setTimeTravelDate: spyOnSetTimeTravelDate,
        updateFilters: spyOnOpenUpdateFilters,
      }),
      mockProvider(KaartService, { toggleInteractions: spyOnToggleInteractions }),
      {
        provide: ConfigService,
        useValue: {
          config: {
            iwt: {
              date: '2022/02/01',
            },
          },
        },
      },
    ],
    mocks: [DrawSearchService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have iwt date', () => {
    expect(spectator.component.dateIwt).toEqual(new Date('2022/02/01'));
  });

  describe('updateFilters', () => {
    beforeEach(() => {
      spyOnOpenUpdateFilters.calls.reset();
    });

    it('should updateFilters on changeCoordinates', () => {
      const locatieFilter: LocatieFilter = {
        coordinaten: {
          RD: [171867, 472837],
          system: ZoekLocatieSystem.RD,
        },
        geometry: null,
        id: '171867.273, 472837.5571',
        name: '171867.273, 472837.5571',
        source: LocationType.CoordinatenRD,
      };

      spectator.component.datePickerDetail = { value: '01-01-2022', valueAsDate: new Date(Date.parse('2022-01-01')) };
      spectator.component.changeCoordinates(locatieFilter);

      expect(spyOnOpenUpdateFilters).toHaveBeenCalledWith({ [FilterName.LOCATIE]: [locatieFilter] }, [
        `${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`,
      ]);

      expect(spyOnSetTimeTravelDate).toHaveBeenCalledWith('2022-01-01');

      expect(spectator.component.showRequiredErrorDate).toBeFalse();
      expect(spectator.component.showRequiredErrorSearch).toBeFalse();
    });

    describe('setMode', () => {
      it('should set the mode', () => {
        spectator.component.setMode(SearchMode.GEBIEDOPDEKAART);

        expect(spectator.component.selectedMode).toEqual(SearchMode.GEBIEDOPDEKAART);
        expect(spectator.component.showRequiredErrorDate).toBeFalse();
        expect(spyOnToggleInteractions).toHaveBeenCalledWith(true);
      });
    });

    describe('should updateFilters on changelocation', () => {
      it('should set activeLocationFilter', () => {
        const activeLocation: LocatieFilter = {
          id: 'adres',
          name: 'Adres',
          pdokId: '',
          source: LocationType.Adres,
          geometry: null,
        };
        spectator.component.changeLocation(activeLocation);

        expect(spectator.component.activeLocationFilter).toEqual(activeLocation);
      });
    });

    it('should updateFilters on changeContour', () => {
      const activeLocationFilter: LocatieFilter = {
        id: 'getekend_gebied',
        name: 'Getekend gebied',
        source: LocationType.Contour,
        geometry: null,
      };
      spectator.component.datePickerDetail = { value: '01-01-2022', valueAsDate: new Date(Date.parse('2022-01-01')) };
      spectator.component.changeContour(activeLocationFilter);

      expect(spyOnOpenUpdateFilters).toHaveBeenCalledWith({ [FilterName.LOCATIE]: [activeLocationFilter] }, [
        `${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`,
      ]);

      expect(spectator.component.showRequiredErrorDate).toBeFalse();
      expect(spectator.component.showRequiredErrorSearch).toBeFalse();
    });

    it('should not updateFilters', () => {
      spectator.component.datePickerDetail = undefined;
      spectator.component.openSuggestion();

      expect(spectator.component.showRequiredErrorDate).toBeTrue();

      spectator.component.datePickerDetail = {} as DatePickerDetail;

      expect(spyOnOpenUpdateFilters).not.toHaveBeenCalled();
      expect(spectator.component.showRequiredErrorDate).toBeTrue();
    });
  });

  describe('handleDateChanged', () => {
    it('should set datePickerDetail with detail', () => {
      const valueAsDate = new Date(Date.parse('2022-02-02'));
      spectator.component.handleDateChanged({ value: 'x', valueAsDate });

      expect(spectator.component.datePickerDetail).toEqual({ value: 'x', valueAsDate });
    });
  });
});
