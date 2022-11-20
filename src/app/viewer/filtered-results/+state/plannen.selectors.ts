import { createSelector, MemoizedSelector } from '@ngrx/store';
import { DocumentListItemVM, mapToDocumentListItem, mapToSelection } from '../types/document-list-item';
import * as fromPlannen from './plannen/plannen.reducer';
import { selectFilteredResultState, State } from './index';
import { LoadingState } from '~model/loading-state.enum';
import { getDocumentVM, ozonFilterOnRegelsBeleid } from '~viewer/documenten/utils/document-utils';
import { RegelStatus } from '~model/regel-status.model';
import { FilterIdentification } from '~viewer/filter/types/filter-options';
import { getFilterOptions } from '~viewer/filter/+state/filter.selectors';
import { Bestuurslaag, BestuurslaagExtern, bestuurslagen } from '~viewer/documenten/types/documenten.model';
import { Regeling } from '~ozon-model/regeling';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Plan } from '~ihr-model/plan';

export const getIsDirty = (): MemoizedSelector<State, boolean> =>
  createSelector(selectFilteredResultState, state => state[fromPlannen.plannenRootKey].isDirty);

const getPlannen = (bestuurslaag: Bestuurslaag): MemoizedSelector<State, Plan[]> =>
  createSelector(selectFilteredResultState, state =>
    state[fromPlannen.plannenRootKey]?.ihr[bestuurslaag]?.entities
      ? Object.values(state[fromPlannen.plannenRootKey].ihr[bestuurslaag].entities)
      : []
  );

// Een omgevingsdocument kan een regeling of omgevingsvergunning zijn
const getRegelingen = (bestuurslaag: Bestuurslaag): MemoizedSelector<State, (Regeling | Omgevingsvergunning)[]> =>
  createSelector(selectFilteredResultState, state =>
    state[fromPlannen.plannenRootKey]?.ozon.entities
      ? Object.values(state[fromPlannen.plannenRootKey].ozon.entities).filter(entity =>
          bestuurslagen[bestuurslaag].includes(entity.aangeleverdDoorEen.bestuurslaag as BestuurslaagExtern)
        )
      : []
  );

const getOntwerpRegelingen = (bestuurslaag: Bestuurslaag): MemoizedSelector<State, OntwerpRegeling[]> =>
  createSelector(selectFilteredResultState, state =>
    state[fromPlannen.plannenRootKey]?.ozonOntwerp.entities
      ? Object.values(state[fromPlannen.plannenRootKey].ozonOntwerp.entities).filter(entity =>
          bestuurslagen[bestuurslaag].includes(entity.aangeleverdDoorEen.bestuurslaag as BestuurslaagExtern)
        )
      : []
  );

export const getLoadMoreUrl = (bestuurslaag: Bestuurslaag): MemoizedSelector<State, string> =>
  createSelector(selectFilteredResultState, state => state[fromPlannen.plannenRootKey].ihr[bestuurslaag]?.loadMoreUrl);

export const getLoadMoreUrls = (
  bestuurslaag?: Bestuurslaag
): MemoizedSelector<State, { bestuurslaag: Bestuurslaag; url: string }[]> => {
  if (bestuurslaag) {
    return createSelector(getLoadMoreUrl(bestuurslaag), url => (url ? [{ bestuurslaag, url }] : []));
  }
  return createSelector(
    getLoadMoreUrl(Bestuurslaag.GEMEENTE),
    getLoadMoreUrl(Bestuurslaag.PROVINCIE),
    getLoadMoreUrl(Bestuurslaag.RIJK),
    (gemeentelijkeUrl, provincialeUrl, rijksUrl) => {
      const bestuurslagenUrls = [];
      if (gemeentelijkeUrl) {
        bestuurslagenUrls.push({ bestuurslaag: Bestuurslaag.GEMEENTE, url: gemeentelijkeUrl });
      }
      if (provincialeUrl) {
        bestuurslagenUrls.push({ bestuurslaag: Bestuurslaag.PROVINCIE, url: provincialeUrl });
      }
      if (rijksUrl) {
        bestuurslagenUrls.push({ bestuurslaag: Bestuurslaag.RIJK, url: rijksUrl });
      }
      return bestuurslagenUrls;
    }
  );
};

export const getStatus = (): MemoizedSelector<State, LoadingState[]> =>
  createSelector(selectFilteredResultState, getFilterOptions, (state, filterOptions) => {
    const regelsBeleidFilterState: FilterIdentification[] = filterOptions['regelsbeleid'];
    const getVastgesteld = !!regelsBeleidFilterState.filter(
      f => f.group === 'regelStatus' && f.id === RegelStatus.Geldend
    ).length;
    const getOntwerp = !!regelsBeleidFilterState.filter(
      f => f.group === 'regelStatus' && f.id === RegelStatus.InVoorbereiding
    ).length;

    const loadingState: LoadingState[] = [];
    Object.values(Bestuurslaag).forEach(bestuurslaag => {
      if (bestuurslaag !== Bestuurslaag.WATERSCHAP) {
        loadingState.push(state[fromPlannen.plannenRootKey].ihr[bestuurslaag].status);
      }
    });
    if (getVastgesteld || (!getVastgesteld && !getOntwerp)) {
      loadingState.push(state[fromPlannen.plannenRootKey].ozon.status);
    }
    if (getOntwerp || (!getVastgesteld && !getOntwerp)) {
      loadingState.push(state[fromPlannen.plannenRootKey].ozonOntwerp.status);
    }
    return loadingState;
  });

export const getSectionIsOpen = (bestuurslaag: Bestuurslaag): MemoizedSelector<State, boolean> =>
  createSelector(selectFilteredResultState, state => state[fromPlannen.plannenRootKey].openSections[bestuurslaag]);

export const getDocumentListItemsVM = (bestuurslaag: Bestuurslaag): MemoizedSelector<State, DocumentListItemVM[]> =>
  createSelector(
    getPlannen(bestuurslaag),
    getRegelingen(bestuurslaag),
    getOntwerpRegelingen(bestuurslaag),
    getFilterOptions,
    (ihrPlannen, ozonRegelingen, ozonOntwerpRegelingen, filterOptions) => {
      const regelsBeleidFilterOptions: FilterIdentification[] = filterOptions['regelsbeleid'];

      /**
       * Ontwerpregelingen worden gebundeld weergegeven, behorende bij een vastgestelde regeling.
       * Ontwerpen zonder een vastgestelde regelingen worden -nog- niet weergegeven.
       */
      const ontwerpRegelingen = ozonOntwerpRegelingen.filter(document =>
        ozonFilterOnRegelsBeleid(document, regelsBeleidFilterOptions)
      );
      const vastgesteld = ozonRegelingen
        .filter(document => ozonFilterOnRegelsBeleid(document, regelsBeleidFilterOptions))
        .map(document => {
          const listItem = mapToDocumentListItem(document);
          return {
            ...listItem,
            bundle: listItem.bundle.concat(
              ontwerpRegelingen
                .filter(ontwerp => ontwerp.identificatie === document.identificatie)
                .map(ontwerp => mapToSelection(getDocumentVM(ontwerp)))
            ),
          };
        });

      /**
       * Ontwerpen zonder een vastgestelde regelingen die niet in de vastgestelde lijst voorkomen
       */

      const ontwerp = ontwerpRegelingen
        .filter(document => !vastgesteld.map(x => x.id).includes(document.identificatie))
        .map(document => mapToDocumentListItem(document));

      return ihrPlannen
        .map(plan => mapToDocumentListItem(plan))
        .concat(vastgesteld)
        .concat(ontwerp);
    }
  );

export const getAllListItemsVM = (): MemoizedSelector<State, DocumentListItemVM[]> =>
  createSelector(
    getPlannen(Bestuurslaag.GEMEENTE),
    getPlannen(Bestuurslaag.PROVINCIE),
    getPlannen(Bestuurslaag.RIJK),
    getRegelingen(Bestuurslaag.GEMEENTE),
    getRegelingen(Bestuurslaag.PROVINCIE),
    getRegelingen(Bestuurslaag.WATERSCHAP),
    getRegelingen(Bestuurslaag.RIJK),
    getOntwerpRegelingen(Bestuurslaag.GEMEENTE),
    getOntwerpRegelingen(Bestuurslaag.PROVINCIE),
    getOntwerpRegelingen(Bestuurslaag.WATERSCHAP),
    getOntwerpRegelingen(Bestuurslaag.RIJK),
    getFilterOptions,
    (
      ihrGemeentelijk,
      ihrProvinciaal,
      ihrRijk,
      ozonGemeentelijk,
      ozonProvinciaal,
      ozonWaterschap,
      ozonRijk,
      ozonOntwerpGemeentelijk,
      ozonOntwerpProvinciaal,
      ozonOntwerpWaterschap,
      ozonOntwerpRijk,
      filterOptions
    ) => {
      const regelsBeleidFilterOptions: FilterIdentification[] = filterOptions['regelsbeleid'];
      const ihrPlannen = ihrGemeentelijk.concat(ihrProvinciaal).concat(ihrRijk);
      const ozonDocumenten = ozonGemeentelijk.concat(ozonProvinciaal).concat(ozonWaterschap).concat(ozonRijk);
      const ozonOntwerpDocumenten = ozonOntwerpGemeentelijk
        .concat(ozonOntwerpProvinciaal)
        .concat(ozonOntwerpWaterschap)
        .concat(ozonOntwerpRijk);
      return ihrPlannen
        .map(plan => mapToDocumentListItem(plan))
        .concat(
          ozonDocumenten
            .filter(omgevingsdocument => ozonFilterOnRegelsBeleid(omgevingsdocument, regelsBeleidFilterOptions))
            .map(omgevingsdocument => mapToDocumentListItem(omgevingsdocument))
        )
        .concat(
          ozonOntwerpDocumenten
            .filter(omgevingsdocument => ozonFilterOnRegelsBeleid(omgevingsdocument, regelsBeleidFilterOptions))
            .map(omgevingsdocument => mapToDocumentListItem(omgevingsdocument))
        );
    }
  );

export const getAllDocumentIds = (): MemoizedSelector<State, string[]> =>
  createSelector(
    getPlannen(Bestuurslaag.GEMEENTE),
    getPlannen(Bestuurslaag.PROVINCIE),
    getPlannen(Bestuurslaag.RIJK),
    getRegelingen(Bestuurslaag.GEMEENTE),
    getRegelingen(Bestuurslaag.PROVINCIE),
    getRegelingen(Bestuurslaag.WATERSCHAP),
    getRegelingen(Bestuurslaag.RIJK),
    getOntwerpRegelingen(Bestuurslaag.GEMEENTE),
    getOntwerpRegelingen(Bestuurslaag.PROVINCIE),
    getOntwerpRegelingen(Bestuurslaag.WATERSCHAP),
    getOntwerpRegelingen(Bestuurslaag.RIJK),
    (
      ihrGemeentelijk,
      ihrProvinciaal,
      ihrRijk,
      ozonGemeentelijk,
      ozonProvinciaal,
      ozonWaterschap,
      ozonRijk,
      ozonOntwerpGemeentelijk,
      ozonOntwerpProvinciaal,
      ozonOntwerpWaterschap,
      ozonOntwerpRijk
    ) => {
      const ihrPlannen = ihrGemeentelijk
        .concat(ihrProvinciaal)
        .concat(ihrRijk)
        .map(x => x.id);
      const ozonDocumenten = ozonGemeentelijk
        .concat(ozonProvinciaal)
        .concat(ozonWaterschap)
        .concat(ozonRijk)
        .map(x => x.identificatie);
      const ozonOntwerpDocumenten = ozonOntwerpGemeentelijk
        .concat(ozonOntwerpProvinciaal)
        .concat(ozonOntwerpWaterschap)
        .concat(ozonOntwerpRijk)
        .map(x => x.technischId);
      return ihrPlannen.concat(ozonDocumenten).concat(ozonOntwerpDocumenten);
    }
  );

export const getInStore = createSelector(
  getPlannen(Bestuurslaag.GEMEENTE),
  getPlannen(Bestuurslaag.PROVINCIE),
  getPlannen(Bestuurslaag.RIJK),
  getRegelingen(Bestuurslaag.GEMEENTE),
  getRegelingen(Bestuurslaag.PROVINCIE),
  getRegelingen(Bestuurslaag.WATERSCHAP),
  getRegelingen(Bestuurslaag.RIJK),
  getOntwerpRegelingen(Bestuurslaag.GEMEENTE),
  getOntwerpRegelingen(Bestuurslaag.PROVINCIE),
  getOntwerpRegelingen(Bestuurslaag.WATERSCHAP),
  getOntwerpRegelingen(Bestuurslaag.RIJK),
  (
    gemeentePlannen,
    provinciePlannen,
    rijkPlannen,
    gemeenteRegelingen,
    provincieRegelingen,
    waterschapRegelingen,
    rijkRegelingen,
    gemeenteOntwerpRegelingen,
    provincieOntwerpRegelingen,
    waterschapOntwerpRegelingen,
    rijkOntwerpRegelingen
  ) =>
    gemeentePlannen.length ||
    provinciePlannen.length ||
    rijkPlannen.length ||
    gemeenteRegelingen.length ||
    provincieRegelingen.length ||
    waterschapRegelingen.length ||
    rijkRegelingen.length ||
    gemeenteOntwerpRegelingen.length ||
    provincieOntwerpRegelingen.length ||
    waterschapOntwerpRegelingen.length ||
    rijkOntwerpRegelingen.length
);
