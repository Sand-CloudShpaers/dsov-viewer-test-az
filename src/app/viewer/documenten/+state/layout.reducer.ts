import { Action, createReducer, on } from '@ngrx/store';
import { LayoutState } from '~viewer/documenten/types/layout.model';
import * as LayoutActions from './layout.actions';

export const documentStructuurLayoutKey = 'document-structuur-layout';

export interface State {
  [key: string]: {
    collapse: {
      [key: string]: LayoutState;
    };
    annotaties: {
      [key: string]: LayoutState;
    };
  };
}

export const initialState: State = {};

const layoutReducerNew = createReducer(
  initialState,
  on(LayoutActions.collapseElementOpen, (state, { documentId, elementId }) => ({
    ...state,
    [documentId]: {
      collapse: { ...state[documentId]?.collapse, [elementId]: LayoutState.OPEN },
      annotaties: state[documentId]?.annotaties,
    },
  })),
  on(LayoutActions.collapseElementClose, (state, { documentId, elementId }) => ({
    ...state,
    [documentId]: {
      collapse: { ...state[documentId]?.collapse, [elementId]: LayoutState.CLOSED },
      annotaties: { ...state[documentId]?.annotaties, [elementId]: LayoutState.CLOSED },
    },
  })),
  on(LayoutActions.toggleElementAnnotation, (state, { documentId, elementId }) => {
    const layoutState =
      state[documentId]?.annotaties && state[documentId]?.annotaties[elementId] === LayoutState.OPEN
        ? LayoutState.CLOSED
        : LayoutState.OPEN;
    return {
      ...state,
      [documentId]: {
        ...state[documentId],
        annotaties: { ...state[documentId]?.annotaties, [elementId]: layoutState },
      },
    };
  }),
  on(LayoutActions.reset, () => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return layoutReducerNew(state, action);
}
