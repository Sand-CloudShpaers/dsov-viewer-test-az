import { Action, createReducer, on } from '@ngrx/store';
import * as DocumentVersiesActions from './document-versies.actions';
import { LoadingState } from '~model/loading-state.enum';
import { Regeling } from '~ozon-model/regeling';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';

export const featureKey = 'documentVersies';

interface DocumentVersies {
  documentId: string;
  vastgesteld?: {
    regelingen?: Regeling[];
    status: LoadingState;
    error?: Error;
  };
  ontwerp?: {
    regelingen?: OntwerpRegeling[];
    status: LoadingState;
    error?: Error;
  };
}

export type State = DocumentVersies;

export const initialState: State = {
  documentId: undefined,
};

const documentVersiesReducer = createReducer(
  initialState,
  on(DocumentVersiesActions.loadingVastgesteld, (state, { documentId }) => ({
    ...state,
    vastgesteld: { status: LoadingState.PENDING },
    documentId,
  })),
  on(DocumentVersiesActions.loadingVastgesteldSuccess, (state, { documentId, regelingen }) => ({
    ...state,
    vastgesteld: { status: LoadingState.RESOLVED, regelingen },
    documentId,
  })),
  on(
    DocumentVersiesActions.loadingVastgesteldFailure,
    (state, { documentId, error }): State => ({
      ...state,
      vastgesteld: { status: LoadingState.REJECTED, error, regelingen: undefined },
      documentId,
    })
  ),
  on(DocumentVersiesActions.loadingOntwerp, (state, { documentId }) => ({
    ...state,
    ontwerp: { status: LoadingState.PENDING },
    documentId,
  })),
  on(DocumentVersiesActions.loadingOntwerpSuccess, (state, { documentId, regelingen }) => ({
    ...state,
    ontwerp: { status: LoadingState.RESOLVED, regelingen },
    documentId,
  })),
  on(
    DocumentVersiesActions.loadingOntwerpFailure,
    (state, { documentId, error }): State => ({
      ...state,
      ontwerp: { status: LoadingState.REJECTED, regelingen: undefined, error },
      documentId,
    })
  ),
  on(DocumentVersiesActions.reset, (): State => initialState)
);

export function reducer(state: State | undefined, action: Action): State {
  return documentVersiesReducer(state, action);
}
