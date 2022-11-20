import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { DocumentElementLinkComponent } from './document-element-link.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { documentBodyElementIHRMock } from '~viewer/documenten/mocks/document-body-element';

describe('DocumentElementLinkComponent', () => {
  let spectator: Spectator<DocumentElementLinkComponent>;

  const createComponent = createComponentFactory({
    component: DocumentElementLinkComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentBodyElement: documentBodyElementIHRMock,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should parse link with title', () => {
    const href = spectator.query('[data-test-id="bijlage-link"]').attributes.getNamedItem('href').value;
    const title = spectator.query('[data-test-id="bijlage-link"]');

    expect(href).toEqual('link');
    expect(title).toHaveText(documentBodyElementIHRMock.titel.content);
  });
});
