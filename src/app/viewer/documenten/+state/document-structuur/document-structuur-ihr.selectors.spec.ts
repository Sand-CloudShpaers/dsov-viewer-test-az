import { DocumentViewContext, LayoutStateVM } from '~viewer/documenten/types/layout.model';
import * as fromSelectors from './document-structuur-ihr.selectors';
import { mockIHRDocumentBodyElement, mockIHRTekst } from './document-structuur-ihr.mock';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';

describe('DocumentStructuurIHRSelectors', () => {
  const documentId = 'blaat';
  const documentViewContext = DocumentViewContext.VOLLEDIG_DOCUMENT;

  describe('getDocumentLichaam', () => {
    it('should return empty array without structuur', () => {
      expect(fromSelectors.getDocumentLichaam(documentId, documentViewContext, null).projector(undefined)).toEqual([]);
      expect(fromSelectors.getDocumentLichaam(documentId, documentViewContext, null).projector(null)).toEqual([]);
    });

    it('should return empty array when there is no ihr', () => {
      expect(fromSelectors.getDocumentLichaam(documentId, documentViewContext, null).projector({})).toEqual([]);
      expect(fromSelectors.getDocumentLichaam(documentId, documentViewContext, null).projector({ data: {} })).toEqual(
        []
      );

      expect(
        fromSelectors.getDocumentLichaam(documentId, documentViewContext, null).projector({ data: { _embedded: {} } })
      ).toEqual([]);
    });

    it('should return empty array when there are no ihr teksten', () => {
      expect(
        fromSelectors
          .getDocumentLichaam(documentId, documentViewContext, null)
          .projector({ data: { ihr: { toelichting: mockIHRTekst } } })
      ).toEqual([]);
    });

    it('should return the right layout and open element when collapse is open', () => {
      const layoutState: LayoutStateVM = {
        'NL.IMRO.PT.regels._1_INLEIDENDEREGELS': { collapse: { isOpen: true, isClosed: false } },
      };
      const result = fromSelectors
        .getDocumentLichaam(documentId, documentViewContext, DocumentSubPagePath.REGELS)
        .projector({ data: { ihr: { regels: mockIHRTekst } } }, layoutState);

      expect(result[0].layout).toEqual({
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
        isFiltered: true,
        isOpen: true,
        showAnnotation: false,
        showElementen: true,
        showContent: false,
        showNumberOnly: false,
        hasAnnotation: false,
        showTitle: false,
        showToggle: true,
        isCollapsible: true,
        isEmptyParagraph: false,
        isActive: true,
        showBreadcrumbs: false,
      });
    });
  });

  it('should return the right layout when element is in Regels op Maat', () => {
    const layoutState: LayoutStateVM = {
      'NL.IMRO.PT.regels._1_Begrippen': { collapse: { isOpen: false, isClosed: false } },
    };
    const regelsOpMaatDocument: RegelsOpMaatDocument = {
      documentId: 'documentId',
      documentType: 'Omgevingsplan',
      regelteksten: [],
      ontwerpRegelteksten: [],
      divisieannotaties: [],
      ontwerpDivisieannotaties: [],
      teksten: [
        {
          externeReferentie: null,
          id: 'NL.IMRO.PT.regels._1_Begrippen',
          inhoud: 'begrippen uitgelegd',
          titel: 'Artikel 1 Begrippen',
          volgnummer: 4,
          kruimelpad: [],
          _links: null,
        },
      ],
    };
    const result = fromSelectors
      .getDocumentLichaam(documentId, DocumentViewContext.REGELS_OP_MAAT, DocumentSubPagePath.REGELS)
      .projector({ data: { ihr: { regels: mockIHRTekst } } }, layoutState, regelsOpMaatDocument);

    expect(result[0].layout).toEqual({
      documentViewContext: DocumentViewContext.REGELS_OP_MAAT,
      isFiltered: true,
      isOpen: true,
      showAnnotation: false,
      showElementen: true,
      showContent: false,
      showNumberOnly: false,
      hasAnnotation: false,
      showTitle: false,
      showToggle: true,
      isCollapsible: true,
      isEmptyParagraph: false,
      isActive: true,
      showBreadcrumbs: false,
    });
  });

  describe('getDocumentStructuurVM', () => {
    const result = fromSelectors
      .getIhrDocumentStructuurVM(documentId, documentViewContext, null)
      .projector([mockIHRDocumentBodyElement]);
    it('should have 1 element', () => {
      expect(result.elementen.length).toBe(1);
    });

    it('should have titel Hoofdstuk 1 INLEIDENDE REGELS', () => {
      expect(result.elementen[0].titel.content).toBe('Hoofdstuk 1 INLEIDENDE REGELS');
    });
  });
});
