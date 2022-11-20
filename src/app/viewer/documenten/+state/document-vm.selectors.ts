import { HttpErrorResponse } from '@angular/common/http';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { normalizeString } from '~general/utils/string.utils';
import { ApiSource } from '~model/internal/api-source';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DocumentSubPage } from '~viewer/documenten/types/document-pages';
import { selectDocumentById, selectDocumentStatus } from './documenten/documenten.selectors';
import { getDocumentVM } from '~viewer/documenten/utils/document-utils';
import { DocumentType } from '~viewer/documenten/types/document-types';
import * as fromDivisieannotatie from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.selectors';
import * as fromRegeltekst from '~viewer/documenten/+state/regeltekst/regeltekst.selectors';
import { State } from '.';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';
import { getExtent } from './document-locatie/document-locatie.selectors';

export const getDocumentenVM = (documentId: string): MemoizedSelector<State, DocumentVM> =>
  createSelector(
    selectDocumentStatus(documentId),
    selectDocumentById(documentId),
    getExtent(documentId),
    (documentStatus, documentEntity, extent): DocumentVM => {
      const status = documentStatus;
      if (status.isResolved) {
        const documentVM = getDocumentVM(documentEntity.data.ihr || documentEntity.data.ozon);
        return { ...documentVM, extent: documentVM.extent || extent, loadingState: documentStatus };
      }
      if (!documentEntity && Object.values(status).every(value => value === false)) {
        return null;
      }
      return {
        bevoegdGezag: null,
        errorStatus: (documentEntity?.error as HttpErrorResponse)?.status || null,
        loadingState: documentStatus,
        documentId,
        statusDateLine: null,
        apiSource: null,
        subPages: [],
        title: null,
        type: null,
      };
    }
  );

export const getDocumentenSubPages = (documentId: string): MemoizedSelector<State, DocumentSubPage[]> =>
  createSelector(getDocumentenVM(documentId), (documentVM): DocumentSubPage[] => {
    if (documentVM) {
      return documentVM.subPages;
    }
    return [];
  });

export const getDocumentenVMFilterTabRouterLink = (documentId: string): MemoizedSelector<State, string> =>
  createSelector(getDocumentenVM(documentId), (documentVM): string => {
    switch (normalizeString(documentVM.type)) {
      case DocumentType.omgevingsVisie:
      case DocumentType.instructie:
      case DocumentType.programma:
        return '../beleid';
      case DocumentType.amvb:
      case DocumentType.ministerieleRegeling:
      case DocumentType.omgevingsverordening:
      case DocumentType.waterschapsverordening:
      case DocumentType.omgevingsPlan:
      case DocumentType.voorbeschermingsregels:
      case DocumentType.aanwijzingsbesluitn2000:
      case DocumentType.toegangsbeperkingsbesluit:
        return '../regels';
      default:
        return '../';
    }
  });

export const getDocumentApiSource = (documentId: string): MemoizedSelector<State, ApiSource> =>
  createSelector(getDocumentenVM(documentId), documentVM => documentVM.apiSource);

export const selectAnnotationVM = (
  documentId: string,
  elementId: string,
  regelgevingtypes: RegelgevingtypeFilter[]
): MemoizedSelector<State, AnnotationVM> =>
  createSelector(
    fromRegeltekst.selectAnnotation(documentId, elementId, regelgevingtypes),
    fromDivisieannotatie.selectAnnotation(documentId, elementId),
    (regelstructuurAnnotation, divisieAnnotation): AnnotationVM => regelstructuurAnnotation || divisieAnnotation
  );
