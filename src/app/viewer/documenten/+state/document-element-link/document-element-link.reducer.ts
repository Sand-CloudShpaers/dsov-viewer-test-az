import * as documentElementLinkActions from './document-element-link.actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface State {
  interneLinkProperties: InterneLinkProperties;
}

export const initialState: State = {
  interneLinkProperties: {
    documentId: '',
    elementId: '',
  },
};

const documentElementLinkReducer = createReducer(
  initialState,
  on(documentElementLinkActions.storeDocumentElementLink, (state, { documentId, elementId, nodeType }) => ({
    ...state,
    interneLinkProperties: { ...state.interneLinkProperties, documentId, elementId, nodeType },
  }))
);

export function reducer(state: State | undefined, action: Action): State {
  return documentElementLinkReducer(state, action);
}

export interface InterneLinkProperties {
  documentId: string;
  elementId: string;
}
