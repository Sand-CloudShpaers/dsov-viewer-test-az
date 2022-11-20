import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InformatielagenService } from './informatielagen.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { ServiceTypes } from '../types/kaartlaag-configuratie';

describe('InformatieLagenService', () => {
  let informatielagenService: InformatielagenService;
  let kaartlagenService: KaartlaagFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InformatielagenService, KaartService],
    });
    informatielagenService = TestBed.inject(InformatielagenService);
    kaartlagenService = TestBed.inject(KaartlaagFactoryService);
    kaartlagenService.layerConfigFormat = {
      informatielagen: [
        {
          id: 'pand',
          type: ServiceTypes.WMS,
          serviceUrl: 'https://service.pdok.nl/lv/bag/wms/v2_0?',
          serviceParameters: {
            layer: 'pand',
            matrixSet: '',
          },
          initialVisible: false,
          maxResolution: 1,
          zIndex: 49,
        },
        {
          id: 'kadastralekaart',
          type: ServiceTypes.WMS,
          serviceUrl: 'https://geodata.nationaalgeoregister.nl/kadastralekaart/wms/v4_0?',
          serviceParameters: {
            layer: 'kadastralekaart',
            matrixSet: '',
          },
          initialVisible: false,
          maxResolution: 1,
          zIndex: 50,
        },
      ],
      achtergrondlagen: [],
      omgevingsdocumentlagen: [],
      ruimtelijkeplannenlagen: null,
    };
  });

  it('should be created', () => {
    expect(informatielagenService).toBeTruthy();
  });

  it('should generate array with 2 WMS layer', () => {
    const informatielagen = informatielagenService.initializeInformatielagen();

    expect(informatielagen.length).toEqual(2);
    expect(informatielagen instanceof Array).toBeTruthy();
  });

  it('should set percelen layer visible', () => {
    const informatielagen = informatielagenService.initializeInformatielagen();
    informatielagenService.setLayers(['kadastralekaart']);
    const laag = informatielagen.find(informatielaag => informatielaag.get('id') === 'kadastralekaart');

    expect(laag.getVisible()).toBeTrue();
  });
});
