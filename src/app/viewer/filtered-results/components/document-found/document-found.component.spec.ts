import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentFoundComponent } from './document-found.component';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { LoadingState } from '~model/loading-state.enum';

describe('DocumentFoundComponent', () => {
  let spectator: Spectator<DocumentFoundComponent>;
  const spyOnGetStatus = jasmine.createSpy('spyOnGetStatus');
  const spyOnGetAllDocumentListItemsVM = jasmine.createSpy('spyOnGetAllDocumentListItemsVM');
  const spyOnGetLoadMoreUrls = jasmine.createSpy('spyOnGetLoadMoreUrls');

  const createComponent = createComponentFactory({
    component: DocumentFoundComponent,
    providers: [
      mockProvider(FilteredResultsFacade, {
        getStatus$: spyOnGetStatus,
        getAllDocumentListItemsVM$: spyOnGetAllDocumentListItemsVM,
        getLoadMoreUrls$: spyOnGetLoadMoreUrls,
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('allLoaded', () => {
    it('should return true when all LoadingStates are resolved', () => {
      expect(spectator.component.allLoaded([LoadingState.RESOLVED, LoadingState.RESOLVED])).toBeTrue();
    });
  });

  describe('isPending', () => {
    it('should return true when at least one LoadingState is pending', () => {
      expect(spectator.component.isPending([LoadingState.PENDING, LoadingState.RESOLVED])).toBeTrue();
    });
  });
});
