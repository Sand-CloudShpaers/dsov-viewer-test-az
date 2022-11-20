import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createHostFactory, mockProvider, SpectatorHost } from '@ngneat/spectator';
import { LoadingState } from '~model/loading-state.enum';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { DocumentListComponent } from '~viewer/filtered-results/components/document-list/document-list.component';
import { of } from 'rxjs';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { documentListItemsVMMock } from '../document-list-section/document-list-section.component.spec';

describe('DocumentListComponent', () => {
  const spyOnOpenDocumentenFilter = jasmine.createSpy('spyOnOpenDocumentenFilter');
  const spyOnLoadDocumenten = jasmine.createSpy('spyOnLoadDocumenten');
  const spyOnGetStatus$ = jasmine.createSpy('spyOnGetStatus').and.returnValue(of([LoadingState.RESOLVED]));
  let spectator: SpectatorHost<DocumentListComponent>;

  const createHost = createHostFactory({
    component: DocumentListComponent,
    providers: [
      mockProvider(FilteredResultsFacade, {
        loadDocumenten: spyOnLoadDocumenten,
        getStatus$: spyOnGetStatus$,
        getSectionIsOpen$: () => of(true),
      }),
      mockProvider(FilterFacade, {
        openDocumentenFilter: spyOnOpenDocumentenFilter,
      }),
      mockProvider(SelectionFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createHost(
      `<dsov-document-list
    [notAllFiltersApply]='shouldShowFiltered$ | async'
  ></dsov-document-list>`
    );
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('viewSelection', () => {
    it('should open regelsOpMaat for selected plannen', () => {
      spectator.component.viewSelection(documentListItemsVMMock[0].bundle);

      expect(spectator.component.isLoadingSelection).toBeTruthy();
      expect(spyOnOpenDocumentenFilter).toHaveBeenCalledWith(documentListItemsVMMock[0].bundle);
    });
  });

  describe('trackByDocumentListItemArray', () => {
    it('should return the index', () => {
      expect(spectator.component.trackByBestuurslagen(123, Bestuurslaag.GEMEENTE)).toBe(Bestuurslaag.GEMEENTE);
    });
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

  describe('hasError', () => {
    it('should return true when at least one LoadingState is erroneous', () => {
      expect(spectator.component.hasError([LoadingState.PENDING, LoadingState.REJECTED])).toBeTrue();
    });
  });
});
