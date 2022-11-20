import * as layerConfigMock from './services/achtergrondlagen.service.mock';
import { KaartlaagFactoryService } from './services/kaartlaag-factory.service';
import { KaartService } from './services/kaart.service';
import { KaartComponent } from './kaart.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { SearchLocationService } from '~services/search-location.service';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { MockComponent } from 'ng-mocks';
import { Map } from 'ol';
import { MeasureService } from './services/measure.service';

describe('KaartComponent', () => {
  let spectator: Spectator<KaartComponent>;
  const createComponent = createComponentFactory({
    component: KaartComponent,
    declarations: [MockComponent(KaartComponent)],
    providers: [
      mockProvider(KaartService),
      mockProvider(FilterFacade),
      mockProvider(MeasureService),
      mockProvider(SearchLocationService),
      {
        provide: KaartlaagFactoryService,
        useValue: {
          layerConfigFormat: layerConfigMock.layerConfig,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        map: new Map({}),
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('onShowMapPanel', () => {
    it('should call next on eventEmitter', () => {
      spyOn(spectator.component.showMapPanel, 'next');
      spectator.component.onShowMapPanel();

      expect(spectator.component.showMapPanel.next).toHaveBeenCalled();
    });
  });
});
