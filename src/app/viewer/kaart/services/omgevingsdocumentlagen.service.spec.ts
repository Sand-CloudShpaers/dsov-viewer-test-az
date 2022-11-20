import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from '~services/error-handling.service';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import * as layerConfigMock from '~viewer/kaart/services/achtergrondlagen.service.mock';
import { OmgevingsdocumentlagenService } from './omgevingsdocumentlagen.service';
import { MapboxStyleService } from '~viewer/kaart/services/helpers/mapbox-style.service';
import { mockProvider } from '@ngneat/spectator';
import VectorTileLayer from 'ol/layer/VectorTile';
import { verbeeldingMock } from '~store/common/highlight/+state/highlight-mock';
import { ApiSource } from '~model/internal/api-source';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { ActivatedRoute } from '@angular/router';

describe('OmgevingsdocumentlagenService', () => {
  let service: OmgevingsdocumentlagenService;
  let kaartlaagFactoryService: KaartlaagFactoryService;
  const applyStyleSpy = jasmine.createSpy('applyStyle').and.callFake(() => Promise.resolve());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        mockProvider(KaartlaagFactoryService, {
          initializeLayer: () => new VectorTileLayer(),
        }),
        {
          provide: MapboxStyleService,
          useValue: { applyStyle: applyStyleSpy },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {},
            },
          },
        },
        ErrorHandlingService,
      ],
    }).compileComponents();

    kaartlaagFactoryService = TestBed.inject(KaartlaagFactoryService);
    kaartlaagFactoryService.layerConfigFormat = layerConfigMock.layerConfig;
    service = TestBed.inject(OmgevingsdocumentlagenService);
    service.initDefault();
    service.initTimeTravel();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set verbeelding', () => {
    it('should call olMapboxStyleService.applyStyle', () => {
      service.set(verbeeldingMock, [], false);

      expect(applyStyleSpy).toHaveBeenCalled();
    });
  });

  describe('set verbeelding, with timetravel', () => {
    it('should call olMapboxStyleService.applyStyle', () => {
      service.set(verbeeldingMock, [], true);

      expect(applyStyleSpy).toHaveBeenCalled();
    });
  });

  describe('Add labels (only for normwaarden)', () => {
    it('should add an extra style layer for label', () => {
      const numStyleLayers = verbeeldingMock.mapboxstyle.layers.length;
      const selection = {
        id: 'nl.imow-gm0297.omgevingsnorm.2019000001',
        name: '7 meter',
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.OMGEVINGSNORM_NORMWAARDE,
      };
      service.set(verbeeldingMock, [selection], false);

      const mapboxStyle = applyStyleSpy.calls.mostRecent().args[1];

      // Should add three extra mapbox style layers (vlaklocaties, lijnlocaties, puntlocaties) for each of the locations
      expect(mapboxStyle.layers.length).toEqual(
        numStyleLayers +
          verbeeldingMock.symboolmetadata.find(
            symbol => symbol.identificator === 'nl.imow-gm0297.omgevingsnorm.2019000001'
          ).locaties.length *
            3
      );

      expect(mapboxStyle.layers[4].layout['text-field']).toEqual('7 meter');
    });

    it('should NOT add extra style layers', () => {
      const numStyleLayers = verbeeldingMock.mapboxstyle.layers.length;
      const selection = {
        id: 'nl.imow-gm0297.omgevingsnorm.2019000002',
        name: 'omgevingswaarde',
        apiSource: ApiSource.OZON,
        objectType: SelectionObjectType.OMGEVINGSWAARDE_NORMWAARDE,
      };
      service.set(verbeeldingMock, [selection], false);

      const mapboxStyle = applyStyleSpy.calls.mostRecent().args[1];

      expect(mapboxStyle.layers.length).toEqual(numStyleLayers);
    });
  });
});
