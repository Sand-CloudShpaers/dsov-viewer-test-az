import { DocumentComponent } from '~ozon-model/documentComponent';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';

export const getEmbeddedComponents = (
  element: DocumentComponent | OntwerpDocumentComponent
): (DocumentComponent | OntwerpDocumentComponent)[] => {
  if (!element?._embedded) {
    return [];
  }
  if ('documentComponenten' in element._embedded) {
    return element._embedded.documentComponenten;
  } else if ('ontwerpDocumentComponenten' in element._embedded) {
    return element._embedded.ontwerpDocumentComponenten;
  } else {
    return [];
  }
};
