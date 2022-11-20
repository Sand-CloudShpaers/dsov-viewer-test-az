import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { DocumentBodyElement, DocumentStructuurVM } from '../../types/documenten.model';
import { selectCurrentDocumentDto } from '../documenten/documenten.selectors';
import { selectDocumentenState, State } from '../index';
import { selectLayoutStateVM } from '../layout.selectors';
import * as fromDocumentStructuur from './document-structuur.reducer';
import { DocumentStructuurIhrService } from './document-structuur-ihr.service';
import * as fromRegelsOpMaat from '~viewer/regels-op-maat/+state/index';
import * as fromRegelsOpMaatDocument from '~viewer/regels-op-maat/+state/document/document.reducer';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { EntityPayload } from '~general/utils/state/entity-action';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';

const getDocumentStructuurState = createSelector(
  selectDocumentenState,
  state => state[fromDocumentStructuur.documentStructuurFeatureKey]
);

const { selectEntities } = fromDocumentStructuur.adapter.getSelectors();

const selectDocumentStructuurEntities = createSelector(getDocumentStructuurState, selectEntities);

export const selectCurrentDocumentStructuur = (
  documentId: string
): MemoizedSelector<State, EntityPayload<fromDocumentStructuur.PayloadData>> =>
  createSelector(selectDocumentStructuurEntities, selectCurrentDocumentDto, (documentEntities, currentDocumentId) =>
    documentId ? documentEntities[documentId] : documentEntities[currentDocumentId.documentId]
  );

export const getIhrDocumentStructuurStatus = (documentId: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(selectDocumentStructuurEntities, entities => derivedLoadingState(entities[documentId]?.status));

export const getDocumentLichaam = (
  documentId: string,
  documentViewContext: DocumentViewContext,
  documentSubPagePath: DocumentSubPagePath
): MemoizedSelector<State, DocumentBodyElement[]> =>
  createSelector(
    selectCurrentDocumentStructuur(documentId),
    selectLayoutStateVM(documentId),
    selectRegelsOpMaatDocument(documentId),
    (structuur, layoutVM, regelsOpMaatDocument): DocumentBodyElement[] => {
      if (!structuur?.data?.ihr) {
        return [];
      }
      const tekst = structuur?.data?.ihr[documentSubPagePath];
      if (!tekst) {
        return [];
      }
      return DocumentStructuurIhrService.mapDocumentStructuurElementen(
        [tekst],
        regelsOpMaatDocument?.teksten,
        0,
        documentViewContext,
        layoutVM,
        [],
        documentId
      ).elementen;
    }
  );

export const getIhrDocumentStructuurVM = (
  documentId: string,
  documentViewContext: DocumentViewContext,
  documentSubPagePath: DocumentSubPagePath
): MemoizedSelector<State, DocumentStructuurVM> =>
  createSelector(
    getDocumentLichaam(documentId, documentViewContext, documentSubPagePath),
    (elementen): DocumentStructuurVM =>
      elementen?.length
        ? {
            elementen,
          }
        : undefined
  );

export const selectRegelsOpMaatDocument = (documentId: string): MemoizedSelector<State, RegelsOpMaatDocument> =>
  createSelector(
    /*  FeatureSelector omdat er vanuit een andere 'root' feature (regels-op-maat) data wordt gehaald.
     *  'Gewoon' de regels-op-maat-selector aanroepen gaat niet werken, omdat we op het niveau van 'documenten' zitten
     */
    createFeatureSelector(fromRegelsOpMaat.regelsOpMaatRootKey),
    (feature: fromRegelsOpMaat.RegelsOpMaatState) =>
      feature[fromRegelsOpMaatDocument.documentFeatureKey].entities[documentId]?.data
  );
