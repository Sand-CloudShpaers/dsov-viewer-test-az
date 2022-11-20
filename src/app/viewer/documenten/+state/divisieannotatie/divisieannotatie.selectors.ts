import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import * as fromDivisieannotatie from './divisieannotatie.reducer';

const getDivisieannotatiesState = createSelector(
  selectDocumentenState,
  state => state[fromDivisieannotatie.divisieannotatieFeatureKey]
);

const { selectAll: selectDivisieannotaties } = fromDivisieannotatie.adapter.getSelectors(getDivisieannotatiesState);

export const selectAnnotation = (documentId: string, elementId: string): MemoizedSelector<State, AnnotationVM> =>
  createSelector(selectDivisieannotaties, (divisieannotaties): AnnotationVM => {
    const divisieannotatie = divisieannotaties?.find(
      x => x.documentIdentificatie === documentId && x.elementId === elementId
    );
    return divisieannotatie
      ? {
          // (ontwerp)documentcomponenten van verschillende omgevingsdocumenten kunnen gelijke id's hebben
          // voor de opslag in de ngrx store wordt dat id gecombineerd met de id van de divisieannotatie en/of technsichId
          // annotationId: joinNonFalsyStrings([elementId, divisieannotatie.id, divisieannotatie.ontwerp?.technischId]),
          annotationId: {
            identificatie: divisieannotatie.vastgesteld?.identificatie || divisieannotatie.ontwerp?.identificatie,
            technischId: divisieannotatie.ontwerp?.technischId,
            elementId,
          },
          themas:
            divisieannotatie.vastgesteld?.themas?.map(thema => ({
              identificatie: thema.code,
              naam: thema.waarde,
            })) ||
            divisieannotatie.ontwerp?.themas?.map(thema => ({
              identificatie: thema.code,
              naam: thema.waarde,
            })),
          vastgesteld: {
            locatiesHref:
              divisieannotatie.vastgesteld?._links.heeftWerkingIn?.href ||
              divisieannotatie.ontwerp?._links.heeftWerkingInVastgesteld?.href,
            gebiedsaanwijzingenHref:
              divisieannotatie.vastgesteld?._links.beschrijftGebiedsaanwijzingen?.href ||
              divisieannotatie.ontwerp?._links.beschrijftGebiedsaanwijzingen?.href,
            hoofdlijnenHref: divisieannotatie.vastgesteld?._links.bevat?.href,
            kaartenHref:
              divisieannotatie.vastgesteld?._links.benoemtKaarten?.href ||
              divisieannotatie.ontwerp?._links.benoemtKaartenVastgesteld?.href,
          },
          ontwerp: divisieannotatie.ontwerp
            ? {
                locatiesHref: divisieannotatie.ontwerp._links.heeftWerkingIn?.href,
                gebiedsaanwijzingenHref: divisieannotatie.ontwerp._links.beschrijftGebiedsaanwijzingen?.href,
                hoofdlijnenHref: divisieannotatie.ontwerp._links.bevat?.href,
                kaartenHref: divisieannotatie.ontwerp._links.benoemtKaarten?.href,
              }
            : undefined,
        }
      : undefined;
  });

export const selectDivisieannotatieByDocumentIdAndElementId = (
  documentId: string,
  elementId: string
): MemoizedSelector<State, fromDivisieannotatie.DivisieannotatieEntity> =>
  createSelector(
    selectDivisieannotaties,
    (divisies): fromDivisieannotatie.DivisieannotatieEntity =>
      divisies?.find(x => x.documentIdentificatie === documentId && x.elementId === elementId)
  );
