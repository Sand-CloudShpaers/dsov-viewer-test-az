import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfigService } from '~services/config.service';
import { FloorPipe } from '../pipes/floor.pipe';
import { FetchLocationInfoService } from '~viewer/kaart/services/fetch-location-info.service';
import { LocationInfoComponent } from './location-info.component';
import * as configMock from '~services/config.service.mock';
import { mockProvider } from '@ngneat/spectator';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { LocationType } from '~model/internal/active-location-type.model';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';

describe('LocationInfoComponent', () => {
  let component: LocationInfoComponent;
  let fixture: ComponentFixture<LocationInfoComponent>;
  let configService: ConfigService;
  const spyOn_updateFilters = jasmine.createSpy('spyOn_updateFilters ');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LocationInfoComponent, FloorPipe],
      providers: [
        mockProvider(FetchLocationInfoService, {}),
        ConfigService,
        mockProvider(FilterFacade, {
          updateFilters: spyOn_updateFilters,
        }),
        mockProvider(SearchFacade),
        mockProvider(NavigationFacade),
      ],
    }).compileComponents();

    configService = TestBed.inject(ConfigService);
    configService.setConfig(configMock.config);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('searchLocation', () => {
    const previousPaths: NavigationPaths = {
      [ViewerPage.OVERZICHT]: null,
      [ViewerPage.THEMAS]: null,
      [ViewerPage.GEBIEDEN]: null,
      [ViewerPage.ACTIVITEITEN]: null,
      [ViewerPage.DOCUMENTEN]: 'documenten',
      [ViewerPage.REGELSOPMAAT]: null,
      [ViewerPage.DOCUMENT]: null,
    };

    it('should searchAddress', () => {
      spyOn_updateFilters.calls.reset();
      component.searchLocation(
        {
          adres: {
            weergavenaam: 'straat nummer postcode plaats',
            pdokid: '123',
          },
        },
        LocationType.Adres,
        previousPaths,
        ''
      );

      expect(spyOn_updateFilters).toHaveBeenCalledWith(
        {
          [FilterName.LOCATIE]: [
            {
              id: 'straat nummer postcode plaats',
              name: 'straat nummer postcode plaats',
              source: LocationType.Adres,
              geometry: null,
            },
          ],
        },
        [`${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`]
      );
    });

    it('should searchCadastral', () => {
      spyOn_updateFilters.calls.reset();
      component.searchLocation(
        {
          perceel: {
            weergavenaam: 'perceeltje-A',
            pdokid: '567',
          },
        },
        LocationType.Perceel,
        previousPaths,
        ''
      );

      expect(spyOn_updateFilters).toHaveBeenCalledWith(
        {
          [FilterName.LOCATIE]: [
            {
              id: 'perceeltje-A',
              name: 'perceeltje-A',
              source: LocationType.Perceel,
              geometry: null,
            },
          ],
        },
        [`${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`]
      );
    });

    it('should searchCoordinates', () => {
      spyOn_updateFilters.calls.reset();
      const zoekLocatieInfo = {
        coordinaten: {
          [ZoekLocatieSystem.RD]: [0, 0],
          system: ZoekLocatieSystem.RD,
        },
      };
      component.searchLocation(zoekLocatieInfo, LocationType.CoordinatenRD, previousPaths, '');

      expect(spyOn_updateFilters).toHaveBeenCalledWith(
        {
          [FilterName.LOCATIE]: [
            {
              id: 'RD',
              name: '0, 0',
              geometry: null,
              source: LocationType.CoordinatenRD,
              coordinaten: { RD: [0, 0], system: 'RD' },
            },
          ],
        },
        [`${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`]
      );
    });
  });

  describe('getAddition', () => {
    it('should should return gebiedsinfo text', () => {
      const previousPaths: NavigationPaths = {
        [ViewerPage.OVERZICHT]: null,
        [ViewerPage.THEMAS]: null,
        [ViewerPage.GEBIEDEN]: 'gebiedsinfo',
        [ViewerPage.ACTIVITEITEN]: null,
        [ViewerPage.DOCUMENTEN]: null,
        [ViewerPage.REGELSOPMAAT]: null,
        [ViewerPage.DOCUMENT]: null,
      };

      expect(component.getAddition(previousPaths, ViewerPage.REGELSOPMAAT)).toEqual(
        'Als u een andere locatie kiest gaat u terug naar Gebieden met regels. Daar ziet u welke gebieden van toepassing zijn op de nieuwe locatie.'
      );
    });

    it('should should return documenten text', () => {
      const previousPaths: NavigationPaths = {
        [ViewerPage.OVERZICHT]: null,
        [ViewerPage.THEMAS]: null,
        [ViewerPage.GEBIEDEN]: null,
        [ViewerPage.ACTIVITEITEN]: null,
        [ViewerPage.DOCUMENTEN]: 'documenten',
        [ViewerPage.REGELSOPMAAT]: null,
        [ViewerPage.DOCUMENT]: null,
      };

      expect(component.getAddition(previousPaths, ViewerPage.REGELSOPMAAT)).toEqual(
        'Als u een andere locatie kiest gaat u terug naar Documenten met regels. Daar ziet u welke documenten van toepassing zijn op de nieuwe locatie.'
      );
    });
  });
});
