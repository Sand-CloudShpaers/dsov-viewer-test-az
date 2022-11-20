import { ApiSource } from '~model/internal/api-source';
import { DocumentBodyElement, DocumentBodyElementType } from '../types/documenten.model';
import { DocumentViewContext } from '../types/layout.model';

export const documentBodyElementOzonMock: DocumentBodyElement = {
  id: 'test',
  documentId: 'documentId',
  apiSource: ApiSource.OZON,
  niveau: 2,
  inhoud: '<Inhoud>test</Inhoud>',
  hasChildren: false,
  type: DocumentBodyElementType.DIVISIETEKST,
  titel: {
    content: '<Opschrift>Opschrift</Opschrift>',
    prefix: 'HOOFDSTUK',
    suffix: '',
  },
  nummer: '1',
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
    showTitle: true,
    showToggle: true,
    showNumberOnly: false,
    showAnnotation: false,
    hasAnnotation: false,
    isEmptyParagraph: false,
    showBreadcrumbs: false,
  },
};

export const documentBodyElementIHRMock: DocumentBodyElement = {
  id: 'testIHR',
  documentId: 'documentId',
  titel: {
    content: 'titelIHR',
  },
  inhoud: null,
  isGereserveerd: false,
  isVervallen: false,
  layout: {
    documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
    showContent: false,
    showElementen: true,
    showToggle: true,
    showNumberOnly: false,
    showTitle: true,
    isCollapsible: true,
    isFiltered: true,
    isOpen: false,
    showAnnotation: false,
    hasAnnotation: false,
    showBreadcrumbs: false,
    isEmptyParagraph: false,
    isActive: true,
  },
  niveau: 2,
  elementen: [],
  isOntwerp: false,
  type: DocumentBodyElementType.AFDELING,
  hasChildren: false,
  apiSource: ApiSource.IHR,
  breadcrumbs: [],
  externeReferentieLinkIHR: 'link',
};
