import { KaartService } from '~viewer/kaart/services/kaart.service';
import { MapAreaComponent } from '~viewer/components/map-area/map-area.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { Map } from 'ol';

describe('MapAreaComponent', () => {
  let spectator: Spectator<MapAreaComponent>;
  const createComponent = createComponentFactory({
    component: MapAreaComponent,
    declarations: [MockComponent(MapAreaComponent)],
    providers: [mockProvider(KaartService)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('onClose', () => {
    it('should set showMapPanel to true', () => {
      spectator.component.togglePanel(new Map({}));

      expect(spectator.component.showPanel).toBeTrue();
    });
  });
});
