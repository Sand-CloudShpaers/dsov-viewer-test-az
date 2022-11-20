import { Action, createReducer, on } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import * as DocumentElementLinkActions from '~viewer/documenten/+state/document-element-link/document-element-link.actions';
import * as DocumentTekstenPlanobjectActions from '~viewer/documenten/+state/document-teksten-planobject/document-teksten-planobject.actions';
import * as OverlayActions from './overlay.actions';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';

export interface State {
  content: string;
  showHelp: boolean;
  showInterneLinkContainer: boolean;
  showDocumentTeksten: boolean;
  showApplicationInfo: boolean;
  loadingStatus: LoadingState;
  title?: string;
  subtitle?: string;
  documentId?: string;
  element?: DocumentBodyElement;
}

export const initialState: State = {
  content: '',
  showHelp: false,
  showInterneLinkContainer: false,
  showDocumentTeksten: false,
  showApplicationInfo: false,
  loadingStatus: LoadingState.RESOLVED,
};

const overlayReducer = createReducer(
  initialState,
  on(
    DocumentTekstenPlanobjectActions.showDocumentTekstenResult,
    (state, { content, title, subtitle, loadingStatus }) => ({
      ...state,
      content,
      showDocumentTeksten: true,
      title,
      subtitle,
      loadingStatus,
    })
  ),
  on(
    DocumentElementLinkActions.showDocumentElementLinkResult,
    (state, { documentId, content, element, title, subtitle, loadingStatus }) => ({
      ...state,
      documentId,
      content,
      element,
      showInterneLinkContainer: true,
      title,
      subtitle,
      loadingStatus,
    })
  ),
  on(OverlayActions.showApplicationInfo, state => ({
    ...state,
    showApplicationInfo: true,
  })),
  on(OverlayActions.showHelp, state => ({
    ...state,
    showHelp: true,
  })),
  on(OverlayActions.closeOverlay, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return overlayReducer(state, action);
}
