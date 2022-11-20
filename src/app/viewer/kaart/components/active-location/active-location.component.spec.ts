import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { Point } from 'ol/geom';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { ActiveLocationComponent } from './active-location.component';

describe('ActiveLocationComponent', () => {
  let spectator: Spectator<ActiveLocationComponent>;
  const spyOnZoomToExtent = jasmine.createSpy('spyOnZoomToExtent');

  const createComponent = createRoutingFactory({
    component: ActiveLocationComponent,
    imports: [],
    providers: [
      mockProvider(FilterFacade),
      mockProvider(KaartService, {
        zoomToExtent: spyOnZoomToExtent,
      }),
    ],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('zoomToLocation', () => {
    it('should zoom to location', () => {
      spectator.component.zoomToLocation({
        id: '',
        name: '',
        geometry: new Point([10000, 10000]),
      });

      expect(spyOnZoomToExtent).toHaveBeenCalled();
    });
  });
});
