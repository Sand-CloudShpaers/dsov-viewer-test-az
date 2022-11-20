import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';

export interface OverlayVM {
  content: string;
  isHeaderWhite: boolean;
  isSmall: boolean;
  hasOverlayShadow: boolean;
  showHelp: boolean;
  showInterneLinkContainer: boolean;
  showDocumentTeksten: boolean;
  showApplicationInfo: boolean;
  loadingStatus: DerivedLoadingState;
  title?: string;
  subtitle?: string;
  documentId?: string;
  element?: DocumentBodyElement;
}
