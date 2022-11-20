import { DocumentComponent } from '~ozon-model/documentComponent';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';
import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { getElementType } from './element-type';

const GERESERVEERD_CONTENT = '[gereserveerd]';
const VERVALLEN_CONTENT = '[vervallen]';

export const getPrefix = (element: DocumentComponent | OntwerpDocumentComponent): string => {
  const type = getElementType(element);
  switch (type) {
    case DocumentBodyElementType.DIVISIETEKST:
    case DocumentBodyElementType.DIVISIE:
      return element.label || '';
    case DocumentBodyElementType.ALGEMENE_TOELICHTING:
    case DocumentBodyElementType.ARTIKELGEWIJZE_TOELICHTING:
    case DocumentBodyElementType.LID:
    case DocumentBodyElementType.AANHEF:
    case DocumentBodyElementType.SLUITING:
    case DocumentBodyElementType.CONDITIEARTIKEL:
      return '';
    case DocumentBodyElementType.PARAGRAAF:
    case DocumentBodyElementType.SUBPARAGRAAF:
    case DocumentBodyElementType.SUBSUBPARAGRAAF:
      return '§';
    case DocumentBodyElementType.BIJLAGE:
      if (!element.nummer && !element.opschrift) {
        return 'BIJLAGE [ongenummerd]';
      }
      if (element.nummer) {
        return 'BIJLAGE';
      }
      return '';
    default:
      return type;
  }
};

export const getSuffix = (element: DocumentComponent | OntwerpDocumentComponent): string => {
  const type = getElementType(element);
  if (type === DocumentBodyElementType.BIJLAGE) {
    return element.gereserveerd ? ` - ${GERESERVEERD_CONTENT}` : element.vervallen ? ` - ${VERVALLEN_CONTENT}` : '';
  } else {
    return element.gereserveerd ? GERESERVEERD_CONTENT : element.vervallen ? VERVALLEN_CONTENT : '';
  }
};

export const getTitle = (element: DocumentComponent | OntwerpDocumentComponent): string => element.opschrift || '';
