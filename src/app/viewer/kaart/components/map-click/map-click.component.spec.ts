import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { mockProvider } from '@ngneat/spectator';
import { StoreModule } from '@ngrx/store';
import { reducers, runtimeChecks } from '~store/state';
import { ConfigService } from '~services/config.service';
import * as configMock from '~services/config.service.mock';
import { MapClickComponent } from '~viewer/kaart/components/map-click/map-click.component';
import { LocationInfoComponent } from '~viewer/kaart/components/map-click/location-info/location-info.component';
import { FloorPipe } from '~viewer/kaart/components/map-click/pipes/floor.pipe';
import { ShowHidePipe } from '~viewer/kaart/components/map-click/pipes/show-hide.pipe';
import * as layerConfigMock from '~viewer/kaart/services/achtergrondlagen.service.mock';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { ImroPlanlagenServiceMock } from '~viewer/kaart/services/imro-planlagen.service.mock';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { LocationInfoNavigationServiceMock } from '~viewer/kaart/services/location-info-navigation.service.mock';
import { LocationInfoNavigationService } from '~viewer/kaart/services/location-info-navigation.service';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MapClickComponent', () => {
  let component: MapClickComponent;
  let fixture: ComponentFixture<MapClickComponent>;
  let kaartlaagFactoryService: KaartlaagFactoryService;
  let configService: ConfigService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot(reducers, { runtimeChecks }),
      ],
      declarations: [MapClickComponent, LocationInfoComponent, FloorPipe, ShowHidePipe],
      providers: [
        mockProvider(KaartService),
        mockProvider(SearchFacade),
        mockProvider(NavigationFacade),
        { provide: ImroPlanlagenService, useClass: ImroPlanlagenServiceMock },
        DisableMapClickService,
        ConfigService,
        { provide: LocationInfoNavigationService, useClass: LocationInfoNavigationServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    configService = TestBed.inject(ConfigService);
    configService.setConfig(configMock.config);

    kaartlaagFactoryService = TestBed.inject(KaartlaagFactoryService);
    kaartlaagFactoryService.layerConfigFormat = layerConfigMock.layerConfig;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClickComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
