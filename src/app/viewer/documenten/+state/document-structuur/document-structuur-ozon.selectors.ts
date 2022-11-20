import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { EntityPayload } from '~general/utils/state/entity-action';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { DocumentComponent } from '~ozon-model/documentComponent';
import { OntwerpDocumentComponent } from '~ozon-model/ontwerpDocumentComponent';
import { selectLayoutStateVM } from '~viewer/documenten/+state/layout.selectors';
import { selectCurrentDocumentDto } from '~viewer/documenten/+state/documenten/documenten.selectors';
import { ImopNodeType } from '~viewer/documenten/types/imop-nodetypes';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import {
  DocumentBodyElement,
  DocumentBodyElementType,
  DocumentStructuurVM,
} from '~viewer/documenten/types/documenten.model';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import * as fromRegelsOpMaat from '~viewer/regels-op-maat/+state/index';
import * as fromRegelsOpMaatDocument from '~viewer/regels-op-maat/+state/document/document.reducer';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';
import { selectDocumentenState, State } from '../index';
import * as fromDocumentStructuur from './document-structuur.reducer';
import { getFilterByDocumentId } from '../structuurelement-filter/structuurelement-filter.selectors';
import { DocumentStructuurOzonService, FilterElement, START_NIVEAU } from './document-structuur-ozon.service';
import { getEmbeddedComponents } from './ozon-helpers/embedded-components';

const getDocumentStructuurState = createSelector(
  selectDocumentenState,
  state => state[fromDocumentStructuur.documentStructuurFeatureKey]
);

const { selectEntities } = fromDocumentStructuur.adapter.getSelectors();

const documentStructuurService = new DocumentStructuurOzonService();

export const selectDocumentStructuurEntities = createSelector(getDocumentStructuurState, selectEntities);

// DocumentComponenten
export const selectCurrentDocumentStructuur = (
  documentId: string
): MemoizedSelector<State, EntityPayload<fromDocumentStructuur.PayloadData>> =>
  createSelector(selectDocumentStructuurEntities, selectCurrentDocumentDto, (documentEntities, currentDocumentId) => {
    if (documentId) {
      return documentEntities[documentId];
    }
    return documentEntities[currentDocumentId.documentId];
  });

export const getOzonDocumentStructuurStatus = (documentId: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(selectDocumentStructuurEntities, entities => derivedLoadingState(entities[documentId]?.status));

export const getDocumentBodyElements = (
  documentId: string,
  documentViewContext: DocumentViewContext,
  documentSubpagePath: DocumentSubPagePath,
  expandedView: boolean
): MemoizedSelector<State, DocumentBodyElement[]> =>
  createSelector(
    selectCurrentDocumentStructuur(documentId),
    selectLayoutStateVM(documentId),
    selectFilterElements(documentId, documentViewContext),
    (structuur, layoutVM, filterElements): DocumentBodyElement[] => {
      /* Bij Regels Op Maat geen gefilterde elementen zijn, dan zijn er dus ook geen 'regels' op 'maat' */
      if (documentViewContext === DocumentViewContext.REGELS_OP_MAAT && !filterElements?.length) {
        return [];
      }
      const ozon = structuur?.data?.ozon;
      /* Geen structuur */
      let documentComponenten: (DocumentComponent | OntwerpDocumentComponent)[];
      if (ozon?._embedded && 'documentComponenten' in ozon._embedded) {
        documentComponenten = ozon._embedded.documentComponenten;
      } else if (ozon?._embedded && 'ontwerpDocumentComponenten' in ozon._embedded) {
        documentComponenten = ozon._embedded.ontwerpDocumentComponenten;
      }

      if (!documentComponenten) {
        return [];
      }

      if (documentSubpagePath === DocumentSubPagePath.TOELICHTING) {
        const root = documentComponenten.find(el => el.type === DocumentBodyElementType.TOELICHTING);
        if (!root) {
          return undefined;
        }
        return documentStructuurService.mapDocumentStructuurElementen(
          root,
          documentId,
          START_NIVEAU,
          filterElements,
          documentViewContext,
          documentSubpagePath,
          layoutVM,
          [],
          expandedView
        ).elementen;
      } else if (documentSubpagePath === DocumentSubPagePath.BIJLAGE) {
        const bijlageElementen = documentComponenten.filter(el => el.type === DocumentBodyElementType.BIJLAGE);
        if (!bijlageElementen.length) {
          return undefined;
        }
        return bijlageElementen.map(element =>
          documentStructuurService.mapDocumentStructuurElement(
            element,
            documentId,
            START_NIVEAU,
            layoutVM,
            !filterElements?.length,
            filterElements,
            documentViewContext,
            documentSubpagePath,
            [],
            expandedView
          )
        );
      } else {
        let output: DocumentBodyElement[] = [];

        [DocumentBodyElementType.AANHEF, DocumentBodyElementType.LICHAAM, DocumentBodyElementType.SLUITING].forEach(
          type => {
            const element = documentComponenten.find(el => el.type === type);
            if (element) {
              if (type === DocumentBodyElementType.LICHAAM) {
                output = output.concat(
                  documentStructuurService.mapDocumentStructuurElementen(
                    element,
                    documentId,
                    START_NIVEAU,
                    filterElements,
                    documentViewContext,
                    documentSubpagePath,
                    layoutVM,
                    [],
                    expandedView
                  ).elementen
                );
              } else if (
                [DocumentViewContext.VOLLEDIG_DOCUMENT, DocumentViewContext.TIJDELIJK_DEEL].includes(
                  documentViewContext
                )
              ) {
                /* Bij een volledig document worden de AANHEF en SLUITING ook toegevoegd aan de structuur */
                element.opschrift = `<Opschrift>${type}</Opschrift>`;
                output = output.concat(
                  documentStructuurService.mapDocumentStructuurElement(
                    element,
                    documentId,
                    START_NIVEAU,
                    layoutVM,
                    !filterElements?.length,
                    filterElements,
                    documentViewContext,
                    documentSubpagePath,
                    [],
                    false
                  )
                );
              }
            }
          }
        );

        return output;
      }
    }
  );

export const getOzonDocumentStructuurVM = (
  documentId: string,
  documentViewContext: DocumentViewContext,
  documentSubPagePath: DocumentSubPagePath,
  expandedView: boolean
): MemoizedSelector<State, DocumentStructuurVM> =>
  createSelector(
    getDocumentBodyElements(documentId, documentViewContext, documentSubPagePath, expandedView),
    (elementen): DocumentStructuurVM =>
      elementen?.length
        ? {
            elementen,
          }
        : undefined
  );

export const getElement = (
  documentId: string,
  id: string,
  nodeType?: ImopNodeType
): MemoizedSelector<State, DocumentBodyElement> =>
  createSelector(selectCurrentDocumentStructuur(documentId), (documentStructuurVM): DocumentBodyElement => {
    const ozon = documentStructuurVM?.data?.ozon;
    let documentComponenten: (DocumentComponent | OntwerpDocumentComponent)[];
    if (ozon?._embedded && 'documentComponenten' in ozon._embedded) {
      documentComponenten = ozon._embedded.documentComponenten;
    } else if (ozon?._embedded && 'ontwerpDocumentComponenten' in ozon._embedded) {
      documentComponenten = ozon._embedded.ontwerpDocumentComponenten;
    }
    const element = findElement(documentComponenten, id, nodeType)[0];

    return element
      ? documentStructuurService.mapDocumentStructuurElement(
          element,
          documentId,
          START_NIVEAU,
          {},
          false,
          [],
          DocumentViewContext.PARTIAL_IN_OVERLAY,
          null,
          [],
          false
        )
      : undefined;
  });

const selectFilterElements = (
  documentId: string,
  documentViewContext: DocumentViewContext
): MemoizedSelector<State, FilterElement[]> =>
  createSelector(
    selectRegelsOpMaatDocument(documentId),
    getFilterByDocumentId(documentId),
    (regelsOpMaatDocument, documentFilter): FilterElement[] => {
      if (documentViewContext === DocumentViewContext.REGELS_OP_MAAT) {
        return documentStructuurService
          .getFilterElementsForRegelsOpMaat(regelsOpMaatDocument?.regelteksten)
          .concat(documentStructuurService.getFilterElementsForRegelsOpMaat(regelsOpMaatDocument?.divisieannotaties))
          .concat(documentStructuurService.getFilterElementsForRegelsOpMaat(regelsOpMaatDocument?.ontwerpRegelteksten))
          .concat(
            documentStructuurService.getFilterElementsForRegelsOpMaat(regelsOpMaatDocument?.ontwerpDivisieannotaties)
          );
      } else if (documentFilter) {
        /* Hoofdlijn en thema's */
        return documentStructuurService
          .getFilterElementsForDivisies(documentFilter.divisieannotaties)
          .concat(documentStructuurService.getFilterElementsForRegelteksten(documentFilter.regelteksten));
      } else {
        return [];
      }
    }
  );

const selectRegelsOpMaatDocument = (documentId: string): MemoizedSelector<State, RegelsOpMaatDocument> =>
  createSelector(
    /*  FeatureSelector omdat er vanuit een andere 'root' feature (regels-op-maat) data wordt gehaald.
     *  'Gewoon' de regels-op-maat-selector aanroepen gaat niet werken, omdat we op het niveau van 'documenten' zitten
     */
    createFeatureSelector(fromRegelsOpMaat.regelsOpMaatRootKey),
    (feature: fromRegelsOpMaat.RegelsOpMaatState) =>
      feature[fromRegelsOpMaatDocument.documentFeatureKey].entities[documentId]?.data
  );

const findElement = (
  elements: (DocumentComponent | OntwerpDocumentComponent)[],
  id: string,
  nodeType?: ImopNodeType
): (DocumentComponent | OntwerpDocumentComponent)[] => {
  if (!elements || elements.length === 0) {
    return [];
  }
  return elements.flatMap(element =>
    resolveExpression(element, id, nodeType) ? element : findElement(getEmbeddedComponents(element), id, nodeType)
  );
};

function resolveExpression(
  element: DocumentComponent | OntwerpDocumentComponent,
  id: string,
  nodeType?: ImopNodeType
): boolean {
  if (nodeType === ImopNodeType.INTIOREF) {
    return element.inhoud?.includes(`wId='${id}'`) && element.type === DocumentBodyElementType.BEGRIP;
  } else {
    return element.expressie === id;
  }
}
