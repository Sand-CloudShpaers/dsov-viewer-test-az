import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { DocumentElementOptionsComponent } from './document-element-options.component';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { ApiSource } from '~model/internal/api-source';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const mockDocumentBodyElement: DocumentBodyElement = {
  id: 'testId',
  documentId: 'documentId',
  titel: {
    content: '<Opschrift>testTitle</Opschrjft>',
  },
  layout: {
    showTitle: false,
    showNumberOnly: false,
    showToggle: true,
    showElementen: false,
    isCollapsible: true,
    isOpen: false,
    showAnnotation: false,
    hasAnnotation: false,
    documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
    showContent: true,
    isFiltered: true,
    isEmptyParagraph: false,
    showBreadcrumbs: false,
  },
  niveau: 1,
  nummer: 'testNummer',
  inhoud: 'testInhoud',
  hasChildren: true,
  apiSource: ApiSource.OZON,
  breadcrumbs: [],
  elementen: null,
  isOntwerp: false,
  isGereserveerd: false,
  isVervallen: false,
};

describe('DocumentElementOptionsComponent', () => {
  let spectator: SpectatorHost<DocumentElementOptionsComponent>;

  const createHost = createHostFactory({
    component: DocumentElementOptionsComponent,
    providers: [provideMockStore({ initialState })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createHost(
      `<dsov-document-element-options
                [structuurelement]="documentBodyElement"
                [documentId]="documentId">
                </dsov-document-element-options>`,
      {
        hostProps: {
          documentBodyElement: mockDocumentBodyElement,
          documentId: 'xyz',
        },
      }
    );
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
