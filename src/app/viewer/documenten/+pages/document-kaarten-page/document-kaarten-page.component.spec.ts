import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentKaartenPageComponent } from '~viewer/documenten/+pages/document-kaarten-page/document-kaarten-page.component';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DocumentKaartenPageComponent', () => {
  let spectator: Spectator<DocumentKaartenPageComponent>;
  const createComponent = createComponentFactory({
    component: DocumentKaartenPageComponent,
    providers: [mockProvider(DocumentenFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });
});
