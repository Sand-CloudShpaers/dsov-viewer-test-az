import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { DocumentHeaderContainerComponent } from './document-header-container.component';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';

describe('DocumentHeaderContainerComponent', () => {
  let spectator: Spectator<DocumentHeaderContainerComponent>;

  const createComponent = createComponentFactory({
    component: DocumentHeaderContainerComponent,
    providers: [
      mockProvider(DocumentenFacade, {
        documentVM$: () =>
          of({
            loadingState: {
              isResolved: true,
            },
          }),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  const documentId = '/akn/nl/act/3';

  const input = { documentId };

  beforeEach(() => {
    spectator = createComponent({ props: input });
  });

  it('should create', () => {
    spectator.detectComponentChanges();

    expect(spectator.component).toBeDefined();
    expect(spectator.queryAll('dsov-document-header').length).toEqual(1);
  });
});
