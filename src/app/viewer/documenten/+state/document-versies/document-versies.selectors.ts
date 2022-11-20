import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromDocumentLocatie from './document-versies.reducer';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { DocumentVersieVM } from '~viewer/documenten/types/document-versie';

const getDocumentVersiesState = createSelector(selectDocumentenState, state => state[fromDocumentLocatie.featureKey]);

export const getVastgesteldVersies = (): MemoizedSelector<State, DocumentVersieVM[]> =>
  createSelector(getDocumentVersiesState, (state): DocumentVersieVM[] => {
    const regelingen = state.vastgesteld?.regelingen;
    return regelingen
      ? regelingen.map(regeling => ({
          identificatie: regeling.identificatie,
          versie: regeling.geregistreerdMet.versie,
          geldigOp: {
            original: regeling.geregistreerdMet.beginGeldigheid,
            date: new Date(regeling.geregistreerdMet.beginGeldigheid),
          },
          inWerkingOp: {
            original: regeling.geregistreerdMet.beginInwerking,
            date: new Date(regeling.geregistreerdMet.beginInwerking),
          },
          beschikbaarOp: regeling.geregistreerdMet.tijdstipRegistratie
            ? {
                original: regeling.geregistreerdMet.tijdstipRegistratie,
                date: new Date(regeling.geregistreerdMet.tijdstipRegistratie),
              }
            : null,
          gepubliceerdOp: {
            original: regeling.geregistreerdMet.tijdstipRegistratie,
            date: new Date(regeling.geregistreerdMet.tijdstipRegistratie),
          },
        }))
      : [];
  });

export const getVastgesteldVersiesStatus = (): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(
    getDocumentVersiesState,
    (state): DerivedLoadingState => derivedLoadingState(state?.vastgesteld?.status)
  );

export const getOntwerpVersies = (): MemoizedSelector<State, DocumentVersieVM[]> =>
  createSelector(getDocumentVersiesState, (state): DocumentVersieVM[] =>
    state.ontwerp?.regelingen?.map(regeling => ({
      identificatie: regeling.technischId,
      gepubliceerdOp: {
        original: regeling.procedureverloop?.ontvangenOp,
        date: new Date(regeling.procedureverloop?.ontvangenOp),
      },
      versie: null,
      beschikbaarOp: null,
      inWerkingOp: null,
      geldigOp: null,
    }))
  );

export const getOntwerpVersiesStatus = (): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getDocumentVersiesState, (state): DerivedLoadingState => derivedLoadingState(state?.ontwerp?.status));
