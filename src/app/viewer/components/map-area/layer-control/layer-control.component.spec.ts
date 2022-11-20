import { LayerControlComponent } from './layer-control.component';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import * as layerConfigMock from '~viewer/kaart/services/achtergrondlagen.service.mock';
import { AchtergrondlagenService } from '~viewer/kaart/services/achtergrondlagen.service';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { InformatielagenService } from '~viewer/kaart/services/informatielagen.service';
import { LayerSwitcherLayer } from '~model/internal/maps/layer-switcher-layer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { Map } from 'ol';
import { KaartService } from '~viewer/kaart/services/kaart.service';

describe('LayerControlComponent', () => {
  const spyOnSetLayers = jasmine.createSpy('spyOnSetLayers');

  let spectator: Spectator<LayerControlComponent>;
  const createComponent = createComponentFactory({
    component: LayerControlComponent,
    declarations: [MockComponent(LayerControlComponent)],
    providers: [
      mockProvider(AchtergrondlagenService, { setLayers: spyOnSetLayers }),
      mockProvider(InformatielagenService, { setLayers: spyOnSetLayers }),
      {
        provide: KaartlaagFactoryService,
        useValue: {
          layerConfigFormat: layerConfigMock.layerConfig,
        },
      },
      mockProvider(KaartService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  describe('onChangge', () => {
    it('should call setLayers on achtergrondlagenService', () => {
      spectator.component.onChange('achtergrondlagen', [{ id: 'id' } as LayerSwitcherLayer]);

      expect(spyOnSetLayers).toHaveBeenCalled();
    });

    it('should call setLayers on informatielagenService', () => {
      spectator.component.onChange('something completely different', [{ id: 'id' } as LayerSwitcherLayer]);

      expect(spyOnSetLayers).toHaveBeenCalled();
    });
  });
});
