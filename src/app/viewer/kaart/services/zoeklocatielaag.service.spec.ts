import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { Point } from 'ol/geom';
import { Style } from 'ol/style';
import { OlStylesConfig } from '~viewer/kaart/types/ol-styles.config';
import { ZoeklocatielaagService } from '~viewer/kaart/services/zoeklocatielaag.service';
import { GeometryFactory } from '~mocks/geometry-factory';
import { LocationType } from '~model/internal/active-location-type.model';

describe('ZoeklocatielaagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [OlStylesConfig],
    }).compileComponents();
    TestBed.inject(OlStylesConfig);
  });

  it('should be created', () => {
    const service: ZoeklocatielaagService = TestBed.inject(ZoeklocatielaagService);

    expect(service).toBeTruthy();
  });

  it('should return an BaseLayer on initializeZoeklocatielaag() with id = zoeklocatie', () => {
    const service: ZoeklocatielaagService = TestBed.inject(ZoeklocatielaagService);
    const layer = service.initializeZoeklocatielaag();

    expect(layer.getProperties()['id']).toEqual('zoeklocatie');
  });

  it('should return a feature array with length 1 when adding a geometry and 0 when removing features', () => {
    const service: ZoeklocatielaagService = TestBed.inject(ZoeklocatielaagService);
    service.initializeZoeklocatielaag();
    const point = new Point([1, 2]);
    service.addZoeklocatie(point);

    expect(service.getFeatures().length).toEqual(1);
    service.removeFeatures();

    expect(service.getFeatures().length).toEqual(0);
  });

  it('should add label for activeLocation', () => {
    const service: ZoeklocatielaagService = TestBed.inject(ZoeklocatielaagService);
    service.initializeZoeklocatielaag();
    const activeLocation = {
      id: 'zoekgebied',
      name: 'zoekgebied',
      geometry: GeometryFactory.createPolygon(),
      source: LocationType.Perceel,
    };
    service.addLabel(activeLocation);
    const style = service.getFeatures()[0].getStyle() as Style;

    expect(style.getText().getText()).toEqual('zoekgebied');
  });

  it('should place label for activeLocation', () => {
    const service: ZoeklocatielaagService = TestBed.inject(ZoeklocatielaagService);
    service.initializeZoeklocatielaag();
    const activeLocation = {
      id: 'zoekgebied',
      name: 'zoekgebied',
      geometry: GeometryFactory.createLineString(),
    };
    service.addZoeklocatie(GeometryFactory.createLineString());
    service.addLabel(activeLocation);
    service.plaatsZoekgebiedLabel([0, 0, 3, 4]);

    expect(service.getFeatures()[1].getGeometry().getExtent()).toEqual([1.5, 2.5, 1.5, 2.5]);
  });
});
