import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentListItemComponent } from './document-list-item.component';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ContentService } from '~services/content.service';
import { HighlightFacade } from '~store/common/highlight/+state/highlight.facade';
import { documentListItemsVMMock } from '../document-list-section/document-list-section.component.spec';

describe('DocumentListItemComponent', () => {
  let spectator: Spectator<DocumentListItemComponent>;
  const spyOnAddSelections = jasmine.createSpy('spyOnAddSelections');
  const spyOnOpenDocumentFilter = jasmine.createSpy('spyOnOpenDocumentFilter');
  const spyOnGetRichContent = jasmine.createSpy('spyOnGetRichContent');

  const createComponent = createRoutingFactory({
    component: DocumentListItemComponent,
    imports: [],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(ContentService, {
        getRichContent: spyOnGetRichContent,
      }),
      mockProvider(SelectionFacade, {
        addSelections: spyOnAddSelections,
      }),
      mockProvider(HighlightFacade),
      mockProvider(FilterFacade, {
        openDocumentenFilter: spyOnOpenDocumentFilter,
      }),
    ],
    declarations: [],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { listItem: documentListItemsVMMock[2] },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should add to selection when checkbox is checked', () => {
    spectator.component.onSelectionChange({ target: { checked: true } } as unknown as Event);

    expect(spyOnAddSelections).toHaveBeenCalledWith(documentListItemsVMMock[2].bundle);
  });

  it('should call openDocumentFilter on openDocumentSelection', () => {
    spectator.component.openDocumentSelection();

    expect(spyOnOpenDocumentFilter).toHaveBeenCalledWith(documentListItemsVMMock[2].bundle);
  });

  describe('hasOntwerpInBundle', () => {
    it('should return true', () => {
      expect(spectator.component.hasOntwerpInBundle(documentListItemsVMMock[2].bundle)).toBeTrue();
    });

    it('should return false', () => {
      expect(spectator.component.hasOntwerpInBundle(documentListItemsVMMock[1].bundle)).toBeFalse();
    });

    it('should return false, when ontwerp', () => {
      expect(spectator.component.hasOntwerpInBundle(documentListItemsVMMock[3].bundle)).toBeFalse();
    });
  });
});
