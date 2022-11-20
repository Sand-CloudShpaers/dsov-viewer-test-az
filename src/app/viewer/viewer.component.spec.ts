import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { ViewerComponent } from './viewer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { PortaalService } from '~portaal/portaal.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { PortaalSessionGetService } from '~portaal/portaal-session-get.service';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayFacade } from '~viewer/overlay/+state/overlay.facade';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { FilterFacade } from '~viewer/filter/filter.facade';

describe('ViewerComponent', () => {
  let spectator: Spectator<ViewerComponent>;

  const createComponent = createComponentFactory({
    component: ViewerComponent,
    imports: [RouterTestingModule],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(PortaalService),
      mockProvider(KaartService),
      mockProvider(PortaalSessionGetService),
      mockProvider(PortaalSessionPutService),
      mockProvider(OverlayFacade),
      mockProvider(FilterFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
