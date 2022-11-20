import { MapboxStyleService } from '~viewer/kaart/services/helpers/mapbox-style.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import * as layerConfigMock from '~viewer/kaart/services/achtergrondlagen.service.mock';

describe('BestemmingsplanlagenService', () => {
  let layerFactoryService: KaartlaagFactoryService;
  const applyStyleSpy = jasmine.createSpy('applyStyle');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [
        MapboxStyleService,
        KaartlaagFactoryService,
        {
          provide: MapboxStyleService,
          useValue: { applyStyle: applyStyleSpy },
        },
      ],
    }).compileComponents();

    layerFactoryService = TestBed.inject(KaartlaagFactoryService);
    layerFactoryService.layerConfigFormat = layerConfigMock.layerConfig;
  });

  it('should be created', () => {
    const service: ImroPlanlagenService = TestBed.inject(ImroPlanlagenService);

    expect(service).toBeTruthy();
  });

  it('resetLagen with add = true should return a LayerGroup with correct length', () => {
    const service: ImroPlanlagenService = TestBed.inject(ImroPlanlagenService);
    const layerGroup = service.resetLagen(['sluw_plan', 'slinks_plan'], true);

    expect(layerGroup.getLayers().getLength()).toEqual(2);
    expect(service['currentPlanIds'].length).toEqual(2);
    expect(service['currentLayers'].length).toEqual(2);
  });

  it('resetLagen with add = false should return an empty LayerGroup', () => {
    const service: ImroPlanlagenService = TestBed.inject(ImroPlanlagenService);
    service['currentPlanIds'] = ['sluw_plan'];
    const layerGroup = service.resetLagen(['sluw_plan'], false);

    expect(service['currentPlanIds'].length).toEqual(0);
    expect(service['currentLayers'].length).toEqual(0);
    expect(layerGroup.getLayers().getLength()).toEqual(0);
  });

  it('resetMap should reset all service variables', () => {
    const service: ImroPlanlagenService = TestBed.inject(ImroPlanlagenService);
    service.resetMap();

    expect(service['currentPlanIds'].length).toEqual(0);
    expect(service['currentLayers'].length).toEqual(0);
    expect(service.lagen.getLayers().getLength()).toEqual(0);
  });
});
