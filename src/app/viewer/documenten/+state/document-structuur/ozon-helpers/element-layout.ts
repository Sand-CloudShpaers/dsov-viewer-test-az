import { DocumentComponent } from '~ozon-model/documentComponent';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';
import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { DocumentElementenLayoutVM, DocumentViewContext, LayoutStateVM } from '~viewer/documenten/types/layout.model';
import { FilterElement } from '../document-structuur-ozon.service';
import { getPrefix, getSuffix, getTitle } from './element-title';
import { getElementType } from './element-type';
import { getEmbeddedComponents } from './embedded-components';

export const getLayout = (
  element: DocumentComponent | OntwerpDocumentComponent,
  hasChildren: boolean,
  hasAnnotation: boolean,
  isFiltered: boolean,
  documentViewContext: DocumentViewContext,
  expandedView: boolean
): DocumentElementenLayoutVM => {
  const titel = getTitle(element);
  const prefix = getPrefix(element);
  const suffix = getSuffix(element);
  const type = getElementType(element);

  const showContent = !!element.inhoud || !!element.gereserveerd || !!element.vervallen;
  const showNumberOnly = !titel.length && !element.gereserveerd && !!element.nummer;

  let showTitle = titel.length + prefix.length + suffix.length > 0;
  let showToggle = showTitle && (showContent || getEmbeddedComponents(element).length > 0) && !expandedView;

  let showBreadcrumbs = false;
  const isCollapsible = showTitle;

  if (documentViewContext === DocumentViewContext.REGELS_OP_MAAT) {
    if (
      [
        DocumentBodyElementType.TITEL,
        DocumentBodyElementType.HOOFDSTUK,
        DocumentBodyElementType.AFDELING,
        DocumentBodyElementType.PARAGRAAF,
        DocumentBodyElementType.SUBPARAGRAAF,
        DocumentBodyElementType.SUBSUBPARAGRAAF,
      ].includes(type)
    ) {
      showTitle = false;
    }
    showBreadcrumbs = type === DocumentBodyElementType.ARTIKEL;
  }

  if (documentViewContext === DocumentViewContext.PARTIAL_IN_OVERLAY) {
    hasAnnotation = false;
    showToggle = false;
  }

  return {
    documentViewContext: documentViewContext,
    showContent,
    showElementen: hasChildren,
    showNumberOnly,
    showToggle,
    showTitle,
    isCollapsible,
    isFiltered,
    isOpen: true,
    showAnnotation: false,
    hasAnnotation,
    isEmptyParagraph: !showContent && !showTitle && showNumberOnly,
    showBreadcrumbs,
    isActive: isFiltered,
  };
};

export const getIsInitialOpen = (
  element: DocumentComponent | OntwerpDocumentComponent,
  documentViewContext: DocumentViewContext,
  filteredElements: FilterElement[],
  isFiltered: boolean,
  layoutVM: LayoutStateVM,
  niveau: number,
  expandedView: boolean
): boolean => {
  const type = getElementType(element);
  if (documentViewContext === DocumentViewContext.VOLLEDIG_DOCUMENT) {
    if (expandedView) {
      return true;
    } else if (filteredElements?.length) {
      /* Bijvoorbeeld via thema of hoofdlijn */
      return isFiltered;
    } else if (Object.keys(layoutVM).some(key => layoutVM[key].isSelected)) {
      /* Als een element is geselecteerd, bijv. vanuit breadcrumbs, dan alles initieel ingeklapt */
      return false;
    } else if (DocumentBodyElementType.ARTIKELGEWIJZE_TOELICHTING === type) {
      /* Dit element ook standaard openklappen */
      return true;
    } else if (niveau < 3) {
      /* Dat is bijvoorbeeld: LICHAAM */
      return true;
    }
  } else if (documentViewContext === DocumentViewContext.REGELS_OP_MAAT) {
    return [
      DocumentBodyElementType.TITEL,
      DocumentBodyElementType.HOOFDSTUK,
      DocumentBodyElementType.AFDELING,
      DocumentBodyElementType.PARAGRAAF,
      DocumentBodyElementType.SUBPARAGRAAF,
      DocumentBodyElementType.SUBSUBPARAGRAAF,
    ].includes(type);
  } else if (documentViewContext === DocumentViewContext.PARTIAL_IN_OVERLAY) {
    /* een gedeeltelijke documentstructuur (bijv. in overlay-panel tgv een interne ozon link) standaard openklappen */
    return true;
  }

  return false;
};
