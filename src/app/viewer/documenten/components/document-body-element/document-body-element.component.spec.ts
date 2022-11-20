import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { ApiSource } from '~model/internal/api-source';
import { DocumentBodyElementComponent } from './document-body-element.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OverlayFacade } from '~viewer/overlay/+state/overlay.facade';
import { PipesModule } from '~general/pipes/pipes.module';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { regelgevingtypeFilterMocks } from '~mocks/regelgevingtypes';
import { of } from 'rxjs';
import { HighlightFacade } from '~store/common/highlight/+state/highlight.facade';

describe('DocumentBodyElementComponent', () => {
  let spectator: Spectator<DocumentBodyElementComponent>;
  const spyOnStartHighlight = jasmine.createSpy('spyOnStartHighlight');
  const spyOnLoadIHRDocumentStructuurForSelectedTekst = jasmine.createSpy(
    'spyOnLoadIHRDocumentStructuurForSelectedTekst'
  );
  const spyOnOpenLink = jasmine.createSpy('spyOnOpenLink');

  const element: DocumentBodyElement = {
    id: 'test',
    documentId: 'documentId',
    apiSource: ApiSource.OZON,
    niveau: 2,
    inhoud: '<p>test</p>',
    hasChildren: false,
    elementen: [],
    breadcrumbs: [],
    isOntwerp: false,
    isGereserveerd: false,
    isVervallen: false,
    layout: {
      documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
      isCollapsible: true,
      isFiltered: true,
      isOpen: true,
      showElementen: false,
      showContent: true,
      showTitle: false,
      showToggle: true,
      showNumberOnly: false,
      showAnnotation: false,
      hasAnnotation: false,
      isEmptyParagraph: false,
      showBreadcrumbs: false,
    },
  };

  const createComponent = createComponentFactory({
    component: DocumentBodyElementComponent,
    imports: [PipesModule],
    providers: [
      mockProvider(DocumentenFacade, {
        loadIHRDocumentStructuurForSelectedTekst: spyOnLoadIHRDocumentStructuurForSelectedTekst,
      }),
      mockProvider(HighlightFacade, {
        startHighlight: spyOnStartHighlight,
      }),
      mockProvider(OverlayFacade, {
        openLink: spyOnOpenLink,
      }),
      mockProvider(GegevenscatalogusProvider),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        documentId: 'id',
        documentBodyElement: element,
      },
    });
    spectator.component.regelgevingtypes$ = of(regelgevingtypeFilterMocks);
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render document-body-element-title', () => {
    spectator.setInput({
      documentId: 'id',
      documentBodyElement: {
        ...element,
        layout: {
          ...element.layout,
          showTitle: true,
        },
      },
    });

    expect(spectator.query('dsov-document-body-element-title')).toExist();
  });

  it('should render document-body-element-content', () => {
    spectator.setInput({
      documentId: 'id',
      documentBodyElement: {
        ...element,
        layout: {
          ...element.layout,
          isCollapsible: false,
          showContent: true,
        },
      },
    });

    expect(spectator.query('dsov-document-body-element-content')).toExist();
  });

  it('should render document-element-link', () => {
    spectator.setInput({
      documentId: 'id',
      documentBodyElement: {
        ...element,
        externeReferentieLinkIHR: 'link',
        layout: {
          ...element.layout,
          isCollapsible: false,
          showContent: false,
        },
      },
    });

    expect(spectator.query('dsov-document-element-link')).toExist();
  });

  it('should render dso-ozon-content, when open and inhoud', () => {
    spectator.setInput({
      documentId: 'id',
      documentBodyElement: {
        ...element,
        layout: {
          ...element.layout,
          isCollapsible: true,
          isOpen: true,
          showTitle: true,
          showContent: true,
        },
      },
    });

    expect(spectator.query('dsov-document-body-element-content')).toExist();
  });

  it('should render child elements', () => {
    spectator.setInput({
      documentId: 'id',
      documentBodyElement: {
        ...element,
        elementen: [element],
        layout: {
          ...element.layout,
          isOpen: true,
          isCollapsible: true,
          showTitle: true,
        },
      },
    });

    expect(spectator.query('dsov-document-body-element')).toExist();
  });

  it('load children for IHR on init', () => {
    spectator.setInput({
      documentId: 'id',
      documentBodyElement: {
        ...element,
        apiSource: ApiSource.IHR,
        hasChildren: true,
      },
    });
    spectator.component.ngOnInit();

    expect(spyOnLoadIHRDocumentStructuurForSelectedTekst).toHaveBeenCalledWith('id', element.id);
  });

  describe('handleAnchorClick', () => {
    it('should openLink', () => {
      spectator.component.handleAnchorClick({ detail: { documentComponent: '#abc' } } as CustomEvent);

      expect(spyOnOpenLink).toHaveBeenCalledWith('id', '#abc', undefined);
    });
  });
});
