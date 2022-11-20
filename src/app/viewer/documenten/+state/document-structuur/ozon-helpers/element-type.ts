import { DocumentComponent } from '~ozon-model/documentComponent';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';
import { DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';

export const getElementType = (element: DocumentComponent | OntwerpDocumentComponent): DocumentBodyElementType =>
  Object.values(DocumentBodyElementType).find(value => value.toString() === element.type.toString().toUpperCase());
