import { MapDrawToolService } from './map-draw-tool.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { Drawing } from '~model/internal/drawing';
import GeometryType from 'ol/geom/GeometryType';

describe('test mapDrawToolService', () => {
  it('test drawOnMap', () => {
    const map = {
      removeInteraction: () => {},
      addInteraction: () => {},
    };
    const kaartService: KaartService = {
      getMap: () => map,
    } as any;

    const service = new MapDrawToolService(kaartService);

    const removeInteractionSpy = spyOn(map, 'removeInteraction').and.callThrough();
    const addInteractionSpy = spyOn(map, 'addInteraction').and.callThrough();

    const drawing: Drawing = service.drawOnMap(GeometryType.POINT);

    expect(removeInteractionSpy.calls.count()).toEqual(1);
    expect(addInteractionSpy.calls.count()).toEqual(1);
    expect(drawing.draw).toBeTruthy();
  });
});
