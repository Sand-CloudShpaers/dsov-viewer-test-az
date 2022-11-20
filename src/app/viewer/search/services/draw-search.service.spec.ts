import { fakeAsync, tick } from '@angular/core/testing';
import GeometryType from 'ol/geom/GeometryType';
import Polygon from 'ol/geom/Polygon';
import { GeometryFactory } from '~mocks/geometry-factory';
import { MapDrawToolService } from './map-draw-tool.service';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { DrawSearchService } from './draw-search.service';
import { FilterFacade } from '~viewer/filter/filter.facade';

describe('draw search service', () => {
  let service: DrawSearchService;
  let mapDrawToolService: MapDrawToolService;
  let disableMapClickService: DisableMapClickService;
  let cbContent: unknown;
  let filterFacade: FilterFacade;

  beforeEach(() => {
    mapDrawToolService = {
      drawOnMap: () => ({
        draw: {
          on: (identifier: string, cb: (arg: unknown) => unknown) => cb(cbContent),
        },
      }),
    } as any;

    disableMapClickService = {
      enable: jasmine.createSpy('enable'),
      disable: () => {},
    } as any;

    service = new DrawSearchService(mapDrawToolService, filterFacade, disableMapClickService);
  });

  const drawPolygon = () => service.draw(GeometryType.POLYGON);
  const generateDrawEvent = (geometry: Polygon) => ({
    feature: {
      getGeometry: () => ({
        getType: () => geometry.getType(),
        getCoordinates: () => geometry.getCoordinates(),
      }),
    },
  });

  it('draw an invalid polygon', fakeAsync(() => {
    service.drawEnd$.subscribe(() => {});
    cbContent = generateDrawEvent(GeometryFactory.createPolygon());
    drawPolygon();
    tick();

    expect(disableMapClickService.enable).toHaveBeenCalled();
  }));
});
