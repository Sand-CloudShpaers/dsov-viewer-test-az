import { DocumentVM } from '~viewer/documenten/types/documenten.model';

export class DocumentVMUtils {
  public getIHRWarning(document: DocumentVM): string | null {
    if (document.isVerwijderdOp) {
      return 'Plan is verwijderd.';
    }
    if (document.isHistorisch) {
      return 'Historisch plan – niet meer geldig.';
    }
    return null;
  }
}
