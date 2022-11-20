import { formattedDate } from '~general/utils/date.utils';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';
import { ApiSource } from '~model/internal/api-source';
import { RegelStatus } from '~model/regel-status.model';
import { Plan } from '~ihr-model/plan';
import { Bestuurslaag, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { getDocumentVM } from '~viewer/documenten/utils/document-utils';

export interface DocumentListItemVM {
  id: string;
  documentType: string;
  isOntwerp: boolean;
  title: string;
  bestuurslaag: Bestuurslaag;
  bevoegdGezagCode: string;
  bevoegdGezagNaam: string;
  typeOwnerLine: string;
  statusDateLine: string;
  status: string;
  regelStatus: string;
  apiSource: ApiSource;
  sortDate: Date;
  /**
   * In de documentenlijst kunnen meerdere documenten gerelateerd zijn aan dit document,
   * ze worden gebundeld weergegeven
   */
  bundle: Selection[];
}

export function mapToDocumentListItem(
  omgevingsdocument: Regeling | OntwerpRegeling | Omgevingsvergunning | Plan
): DocumentListItemVM {
  const documentVM = getDocumentVM(omgevingsdocument);

  return {
    id: documentVM.documentId,
    documentType: documentVM.type,
    isOntwerp: documentVM.isOntwerp,
    title: documentVM.title,
    status: documentVM.status,
    regelStatus: documentVM.isOntwerp ? RegelStatus.InVoorbereiding : RegelStatus.Geldend,
    bestuurslaag: documentVM.bevoegdGezag.bestuurslaag,
    bevoegdGezagCode: documentVM.bevoegdGezag.bestuurslaag === 'rijk' ? '0000' : documentVM.bevoegdGezag.code,
    bevoegdGezagNaam: documentVM.bevoegdGezag.bestuurslaag === 'rijk' ? 'Het Rijk' : documentVM.bevoegdGezag.naam,
    typeOwnerLine: `${documentVM.type} - ${documentVM.bevoegdGezag.naam}`,
    statusDateLine: documentVM.statusDateLine,
    sortDate: getSortDate(documentVM),
    apiSource: documentVM.apiSource,
    bundle: [mapToSelection(documentVM)],
  };
}

export function mapToSelection(document: DocumentVM): Selection {
  return {
    id: document.documentId,
    documentDto: {
      documentId: document.documentId,
      documentType: document.type,
    },
    name: 'Document',
    isOntwerp: document.isOntwerp,
    apiSource: document.apiSource,
    objectType: SelectionObjectType.REGELINGSGEBIED,
    symboolcode: document.apiSource === ApiSource.IHR ? 'plangebied_grens' : 'regelingsgebied',
    locatieIds: document.apiSource === ApiSource.IHR ? [document.documentId] : null,
  };
}

function getSortDate(documentVM: DocumentVM): Date {
  /* Standaard */
  let dateValue = documentVM.inwerkingVanaf;

  /* Als er geen 'inwerking vanaf' is */
  if (!dateValue) {
    dateValue = documentVM.geldigVanaf;
  }

  /* Als het een document met status 'ontwerp' is */
  if (documentVM.isOntwerp) {
    dateValue = documentVM.bekendOp;
    if (!dateValue) {
      dateValue = documentVM.ontvangenOp;
    }
  }
  return dateValue || new Date(formattedDate(new Date()));
}
