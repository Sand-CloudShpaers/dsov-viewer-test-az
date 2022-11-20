import { DocumentComponent } from '~ozon-model/documentComponent';
import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { getIsInitialOpen, getLayout } from './element-layout';

const mockElement: DocumentComponent = {
  identificatie: '',
  expressie: '',
  label: 'Artikel',
  type: DocumentBodyElementType.ARTIKEL,
  volgordeNummer: 0,
  inhoud: 'inhoud',
  _links: {
    self: {
      href: '',
    },
    isOnderdeelVan: {
      href: '',
    },
  },
};

describe('ElementLayout', () => {
  describe('getIsInitialOpen', () => {
    it('should return false, when context is: regels op maat', () => {
      expect(getIsInitialOpen(mockElement, DocumentViewContext.REGELS_OP_MAAT, [], false, {}, 5, false)).toBeFalse();
    });

    it('should return false, when context is: regels op maat and element is LID', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.LID },
          DocumentViewContext.REGELS_OP_MAAT,
          [],
          false,
          {},
          5,
          false
        )
      ).toBeFalse();
    });

    it('should return true, when soort is LID', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.LICHAAM },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [],
          false,
          {},
          1,
          false
        )
      ).toBeTrue();
    });

    it('should return false, when ViewContext is TIJDELIJK_DEEL', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.LICHAAM },
          DocumentViewContext.TIJDELIJK_DEEL,
          [],
          false,
          {},
          1,
          false
        )
      ).toBeFalse();
    });

    it('should return true, when soort is ARTIKELGEWIJZE_TOELICHTING', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.ARTIKELGEWIJZE_TOELICHTING },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [],
          false,
          {},
          5,
          false
        )
      ).toBeTrue();
    });

    it('should return true, when niveau < 3', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.ARTIKELGEWIJZE_TOELICHTING },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [],
          false,
          {},
          2,
          false
        )
      ).toBeTrue();
    });

    it('should return false, when element is selected from breadcrumbs', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.ARTIKELGEWIJZE_TOELICHTING },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [],
          false,
          {
            ['elementId']: {
              isSelected: true,
            },
          },
          2,
          false
        )
      ).toBeFalse();
    });

    it('should return false, when element is filtered by thema', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.HOOFDSTUK },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [
            {
              identificatie: 'elementId',
              kruimelpad: ['parentId'],
            },
          ],
          true,
          {},
          5,
          false
        )
      ).toBeTrue();
    });

    it('should return false, when element is not filtered by thema', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.HOOFDSTUK },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [
            {
              identificatie: 'elementId',
              kruimelpad: ['parentId'],
            },
          ],
          false,
          {},
          5,
          false
        )
      ).toBeFalse();
    });

    it('should return false, when element is bijlage', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.BIJLAGE },
          DocumentViewContext.BIJLAGE,
          [],
          false,
          {},
          1,
          false
        )
      ).toBeFalse();
    });

    it('should return true, when in expanded view', () => {
      expect(
        getIsInitialOpen(
          { ...mockElement, type: DocumentBodyElementType.BIJLAGE },
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          [],
          false,
          {},
          8,
          true
        )
      ).toBeTrue();
    });
  });

  describe('getLayout', () => {
    it('should return layout, with artikel in full document', () => {
      expect(getLayout(mockElement, false, false, false, DocumentViewContext.VOLLEDIG_DOCUMENT, false)).toEqual({
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
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });

    it('should return layout, when TIJDELIJK_DEEL', () => {
      expect(getLayout(mockElement, false, false, false, DocumentViewContext.TIJDELIJK_DEEL, false)).toEqual({
        documentViewContext: DocumentViewContext.TIJDELIJK_DEEL,
        showContent: true,
        showElementen: false,
        isCollapsible: true,
        showToggle: true,
        showNumberOnly: false,
        showTitle: true,
        isFiltered: false,
        isOpen: true,
        showAnnotation: false,
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });

    it('should return layout, with no toggle', () => {
      expect(
        getLayout({ ...mockElement, inhoud: null }, false, false, false, DocumentViewContext.VOLLEDIG_DOCUMENT, false)
      ).toEqual({
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
        showContent: false,
        showElementen: false,
        isCollapsible: true,
        showToggle: false,
        showNumberOnly: false,
        showTitle: true,
        isFiltered: false,
        isOpen: true,
        showAnnotation: false,
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });

    it('should return layout, with toggle', () => {
      expect(
        getLayout(
          {
            ...mockElement,
            vervallen: true,
            inhoud: null,
          },
          false,
          false,
          false,
          DocumentViewContext.VOLLEDIG_DOCUMENT,
          false
        )
      ).toEqual({
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
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });

    it('should return layout, with hoofdstuk in regels op maat', () => {
      expect(
        getLayout(
          { ...mockElement, type: DocumentBodyElementType.HOOFDSTUK },
          false,
          false,
          false,
          DocumentViewContext.REGELS_OP_MAAT,
          false
        )
      ).toEqual({
        documentViewContext: DocumentViewContext.REGELS_OP_MAAT,
        showContent: true,
        showElementen: false,
        isCollapsible: true,
        showToggle: true,
        showNumberOnly: false,
        showTitle: false,
        isFiltered: false,
        isOpen: true,
        showAnnotation: false,
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });

    it('should return layout, with annotaties', () => {
      expect(getLayout(mockElement, false, true, false, DocumentViewContext.VOLLEDIG_DOCUMENT, false)).toEqual({
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
      });
    });

    it('should return layout, with no annotaties and toggle when in partial view', () => {
      expect(getLayout(mockElement, false, true, false, DocumentViewContext.PARTIAL_IN_OVERLAY, false)).toEqual({
        documentViewContext: DocumentViewContext.PARTIAL_IN_OVERLAY,
        showContent: true,
        showElementen: false,
        showToggle: false,
        showNumberOnly: false,
        showTitle: true,
        isCollapsible: true,
        isFiltered: false,
        isOpen: true,
        showAnnotation: false,
        hasAnnotation: false,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });

    it('should return layout, with no toggle and no init annotations when in expanded view', () => {
      expect(
        getLayout({ ...mockElement, inhoud: null }, false, true, false, DocumentViewContext.VOLLEDIG_DOCUMENT, true)
      ).toEqual({
        documentViewContext: DocumentViewContext.VOLLEDIG_DOCUMENT,
        showContent: false,
        showElementen: false,
        isCollapsible: true,
        showToggle: false,
        showNumberOnly: false,
        showTitle: true,
        isFiltered: false,
        isOpen: true,
        showAnnotation: false,
        hasAnnotation: true,
        isEmptyParagraph: false,
        isActive: false,
        showBreadcrumbs: false,
      });
    });
  });
});
