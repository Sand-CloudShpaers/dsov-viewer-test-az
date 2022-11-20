import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import TileLayer from 'ol/layer/Tile';
import { TestStore } from '~mocks/test-store';
import { AchtergrondlagenService } from './achtergrondlagen.service';
import * as layerConfigMock from '~viewer/kaart/services/achtergrondlagen.service.mock';
import { KaartlaagFactoryService } from './kaartlaag-factory.service';

describe('AchtergrondlagenService', () => {
  let achtergrondlagenService: AchtergrondlagenService;
  let kaartlaagFactoryService: KaartlaagFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AchtergrondlagenService, HttpClient, { provide: Store, useClass: TestStore }],
    });
    achtergrondlagenService = TestBed.inject(AchtergrondlagenService);
    kaartlaagFactoryService = TestBed.inject(KaartlaagFactoryService);
    kaartlaagFactoryService.layerConfigFormat = layerConfigMock.layerConfig;
  });

  it('should be created', () => {
    expect(achtergrondlagenService).toBeTruthy();
  });

  it('should generate array with 5 WMTS layers', () => {
    const backGroundLayers = achtergrondlagenService.initializeAchtergrondlagen();

    expect(backGroundLayers.length).toEqual(3);
    expect(backGroundLayers instanceof Array).toBeTruthy();
    expect(backGroundLayers[0] instanceof TileLayer).toBeTruthy();
  });

  it('should (re)set achtergondlaag visibility', () => {
    const achtergrondlagen = achtergrondlagenService.initializeAchtergrondlagen();

    expect(achtergrondlagen[0].getVisible()).toEqual(true);
    expect(achtergrondlagen[1].getVisible()).toEqual(true);
    expect(achtergrondlagen[2].getVisible()).toEqual(false);
    achtergrondlagenService.setAchtergrondlaag('Actueel_ortho25');

    expect(achtergrondlagen[2].getVisible()).toEqual(true);
  });
});
