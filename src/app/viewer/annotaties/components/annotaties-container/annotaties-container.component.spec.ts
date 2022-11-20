import { AnnotatiesContainerComponent } from './annotaties-container.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { ApiSource } from '~model/internal/api-source';
import { regelgevingtypeFilterMocks } from '~mocks/regelgevingtypes';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { DocumentElementenLayoutVM, DocumentViewContext } from '~viewer/documenten/types/layout.model';

describe('AnnotatiesContainerComponent', () => {
  let spectator: Spectator<AnnotatiesContainerComponent>;
  const spyOnAnnotation = jasmine.createSpy('spyOnAnnotation');
  const spyOnRegelTekst = jasmine.createSpy('showRegeltekstForElement');
  const spyOnToggleAnnotation = jasmine.createSpy('spyOnToggleAnnotation');

  const layoutMock: DocumentElementenLayoutVM = {
    documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
    showContent: true,
    showElementen: false,
    isCollapsible: true,
    showToggle: true,
    showNumberOnly: false,
    showTitle: true,
    isFiltered: false,
    isOpen: true,
    showAnnotation: false,
    hasAnnotation: true,
    isEmptyParagraph: false,
    isActive: false,
    showBreadcrumbs: false,
  };

  const elementMock: DocumentBodyElement = {
    id: 'id',
    documentId: 'documentId',
    layout: layoutMock,
    hasChildren: false,
    apiSource: ApiSource.OZON,
    breadcrumbs: [],
    isOntwerp: false,
    isGereserveerd: false,
    isVervallen: false,
  };

  const annotationMock: AnnotationVM = {
    annotationId: {
      identificatie: '',
      elementId: '',
    },
    typeRegelgeving: 'Instructieregel',
    themas: [{ identificatie: '1', naam: 'thema' }],
    vastgesteld: {
      activiteitenHref: '',
      omgevingswaardenHref: '',
      omgevingsnormenHref: '',
      gebiedsaanwijzingenHref: '',
      locatiesHref: '',
    },
  };

  const createComponent = createComponentFactory({
    component: AnnotatiesContainerComponent,
    providers: [
      mockProvider(DocumentenFacade, {
        annotation$: spyOnAnnotation,
        loadRegeltekst: spyOnRegelTekst,
        toggleAnnotation: spyOnToggleAnnotation,
      }),
      mockProvider(FilterFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
      props: { element: elementMock, documentId: 'xyz', regelgevingtypes: regelgevingtypeFilterMocks },
    });
    spectator.component.annotation$ = of(annotationMock);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize observables and load annotation', () => {
      spectator.component.ngOnInit();

      expect(spyOnAnnotation).toHaveBeenCalledWith('xyz', elementMock, regelgevingtypeFilterMocks);
    });
  });

  describe('toggleAnnotation', () => {
    it('should toggle annotation', () => {
      spectator.component.toggleAnnotation();

      expect(spyOnToggleAnnotation).toHaveBeenCalledWith('xyz', 'id');
    });
  });
});
