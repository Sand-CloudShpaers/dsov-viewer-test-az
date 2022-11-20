import { merge } from 'lodash-es';
import { Document } from '~model/internal/document/types/document';
import { ApiSource } from '~model/internal/api-source';

export const createInternalDocumentMock = (document: Partial<Document> = {}): Document => {
  const mockDoc: Document = {
    id: 'leuk-document',
    card: {
      title: 'dit is een document van een bepaald type',
      status: null,
      geldigVanafDate: null,
      regelStatus: null,
      dossierStatus: null,
      type: 'geen-type',
      beleidsmatigVerantwoordelijkeOverheid: null,
      isHistorisch: false,
      isVerwijderdOpDate: null,
    },
    content: null,
    olGeometry: null,
    apiSource: ApiSource.OZON,
  };
  merge(mockDoc, document);
  return mockDoc;
};
