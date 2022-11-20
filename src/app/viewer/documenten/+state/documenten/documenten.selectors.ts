import { createSelector, MemoizedSelector } from '@ngrx/store';
import { Plan } from '~ihr-model/plan';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';
import { EntityPayload } from '~general/utils/state/entity-action';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { selectDocumentenState, State } from '../index';
import * as fromDocumenten from './documenten.reducer';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { TimeTravelDates } from '~model/time-travel-dates';

const getDocumentenState = createSelector(selectDocumentenState, state => state[fromDocumenten.documentenFeatureKey]);

export const { selectEntities, selectAll } = fromDocumenten.adapter.getSelectors(getDocumentenState);

const selectDocumentenStatus = createSelector(getDocumentenState, fromDocumenten.getStatus);

export const selectCurrentDocumentDto = createSelector(getDocumentenState, fromDocumenten.selectedDocumentDto);
export const selectCurrentElementId = createSelector(getDocumentenState, fromDocumenten.selectedElementId);

export const selectCurrentDocument = (): MemoizedSelector<
  State,
  EntityPayload<{ ozon?: Regeling | OntwerpRegeling | Omgevingsvergunning; ihr?: Plan }>
> =>
  createSelector(
    selectEntities,
    selectCurrentDocumentDto,
    (documentEntities, currentDocumentId) => documentEntities[currentDocumentId.documentId]
  );

export const selectDocumentById = (
  id: string
): MemoizedSelector<State, EntityPayload<{ ozon?: Regeling | OntwerpRegeling | Omgevingsvergunning; ihr?: Plan }>> =>
  createSelector(selectEntities, documentEntities => documentEntities[id]);

export const selectDocumentByTimeTravelDates = (
  documentId: string,
  timeTravelDates: TimeTravelDates
): MemoizedSelector<State, EntityPayload<{ ozon?: Regeling | OntwerpRegeling | Omgevingsvergunning; ihr?: Plan }>> =>
  createSelector(selectAll, list =>
    list.find(item => {
      const document = item.data?.ozon as Regeling;
      return (
        document?.identificatie === documentId &&
        document?.geregistreerdMet?.beginInwerking === timeTravelDates.inWerkingOp
      );
    })
  );

export const getDocumentenStatus = createSelector(selectDocumentenStatus, derivedLoadingState);
export const selectDocumentStatus = (documentId: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(selectEntities, documentEntities =>
    documentEntities[documentId]?.status
      ? derivedLoadingState(documentEntities[documentId].status)
      : {
          isLoading: false,
          isIdle: false,
          isPending: false,
          isResolved: false,
          isRejected: false,
          isLoaded: false,
        }
  );

export const selectOntwerpLink = (documentId: string): MemoizedSelector<State, string> =>
  createSelector(selectDocumentById(documentId), (document): string => {
    const links = (document.data?.ozon as Regeling)?._links.heeftBeoogdeOpvolgers;
    return links?.length ? links[0].href : undefined;
  });
