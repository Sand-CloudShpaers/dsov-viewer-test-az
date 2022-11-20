import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentFoundContainerComponent } from '~viewer/components/document-found-container/document-found-container.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

describe('DocumentFoundContainerComponent', () => {
  let spectator: Spectator<DocumentFoundContainerComponent>;
  const spyOnLoadDocumenten = jasmine.createSpy('spyOnLoadDocumenten');

  const createComponent = createComponentFactory({
    component: DocumentFoundContainerComponent,
    providers: [mockProvider(FilteredResultsFacade, { loadDocumenten: spyOnLoadDocumenten })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load documenten', () => {
      spectator.component.ngOnInit();

      expect(spyOnLoadDocumenten).toHaveBeenCalled();
    });
  });
});
