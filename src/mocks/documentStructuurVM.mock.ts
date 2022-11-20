import { DocumentStructuurVM } from '~viewer/documenten/types/documenten.model';

export const createDocumentStructuurVMMock = (): DocumentStructuurVM => {
  const structuur: DocumentStructuurVM = {
    elementen: [],
  };

  return structuur;
};
