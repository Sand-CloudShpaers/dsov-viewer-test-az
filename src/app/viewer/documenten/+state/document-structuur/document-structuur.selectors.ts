import { createSelector, MemoizedSelector } from '@ngrx/store';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

import { getOzonDocumentStructuurStatus, getOzonDocumentStructuurVM } from './document-structuur-ozon.selectors';
import { getIhrDocumentStructuurStatus, getIhrDocumentStructuurVM } from './document-structuur-ihr.selectors';
import { DocumentStructuurVM } from '~viewer/documenten/types/documenten.model';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { State } from '..';

export const getDocumentStructuurStatus = (documentId: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(
    getOzonDocumentStructuurStatus(documentId),
    getIhrDocumentStructuurStatus(documentId),
    (ozonDocumentStructuurStatus, ihrDocumentStructuurStatus): DerivedLoadingState =>
      ozonDocumentStructuurStatus || ihrDocumentStructuurStatus
  );

export const getDocumentStructuurVM = (
  documentId: string,
  documentViewContext: DocumentViewContext,
  documentSubPagePath: DocumentSubPagePath,
  expandedView: boolean
): MemoizedSelector<State, DocumentStructuurVM> =>
  createSelector(
    getOzonDocumentStructuurVM(documentId, documentViewContext, documentSubPagePath, expandedView),
    getIhrDocumentStructuurVM(documentId, documentViewContext, documentSubPagePath),
    (ozonDocumentStructuur, ihrDocumentStructuur): DocumentStructuurVM => ozonDocumentStructuur || ihrDocumentStructuur
  );
