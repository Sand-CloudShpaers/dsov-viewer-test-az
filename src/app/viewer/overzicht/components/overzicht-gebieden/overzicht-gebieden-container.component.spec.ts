import { OverzichtGebiedenContainerComponent } from './overzicht-gebieden-container.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { GebiedsInfoFacade } from '~viewer/gebieds-info/+state/gebieds-info.facade';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContentService } from '~services/content.service';

describe('OverzichtGebiedenContainerComponent', () => {
  let spectator: Spectator<OverzichtGebiedenContainerComponent>;

  const createComponent = createComponentFactory({
    component: OverzichtGebiedenContainerComponent,
    providers: [
      GebiedsInfoFacade,
      provideMockStore({ initialState }),
      mockProvider(GebiedsInfoFacade),
      mockProvider(ContentService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
