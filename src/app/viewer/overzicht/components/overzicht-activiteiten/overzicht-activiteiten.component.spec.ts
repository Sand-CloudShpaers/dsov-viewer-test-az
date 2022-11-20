import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverzichtActiviteitenComponent } from './overzicht-activiteiten.component';
import { ActiviteitenFacade } from '~viewer/overzicht/activiteiten/+state/activiteiten.facade';
import { ContentService } from '~services/content.service';

describe('OverzichtActiviteitenComponent', () => {
  let spectator: Spectator<OverzichtActiviteitenComponent>;
  const spyOnLoadActiviteiten = jasmine.createSpy('spyOnLoadActiviteiten');

  const createComponent = createComponentFactory({
    component: OverzichtActiviteitenComponent,
    providers: [
      mockProvider(ActiviteitenFacade, { loadActiviteiten: spyOnLoadActiviteiten }),
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
