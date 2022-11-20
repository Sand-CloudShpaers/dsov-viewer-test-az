import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromRegeltekst from './regeltekst.reducer';
import { RegeltekstEntity } from './regeltekst.reducer';
import { AnnotationVM } from '../../types/annotation';
import { Regeltekst } from '~ozon-model/regeltekst';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';

const getRegeltekstState = createSelector(selectDocumentenState, state => state[fromRegeltekst.regeltekstFeatureKey]);

const { selectAll: selectRegelteksten } = fromRegeltekst.adapter.getSelectors(getRegeltekstState);

export const selectAnnotation = (
  documentId: string,
  elementId: string,
  regelgevingtypes: RegelgevingtypeFilter[]
): MemoizedSelector<State, AnnotationVM> =>
  createSelector(selectRegelteksten, (regelteksten): AnnotationVM => {
    const regeltekst = regelteksten?.find(x => x.documentIdentificatie === documentId && x.elementId === elementId);
    return regeltekst
      ? {
          // (ontwerp)documentcomponenten van verschillende omgevingsdocumenten kunnen gelijke id's hebben
          // voor de opslag in de ngrx store wordt dat id gecombineerd met de id van de regeltekst en/of technsichId
          // annotationId: joinNonFalsyStrings([elementId, regeltekst.id, regeltekst.ontwerp?.technischId]),
          annotationId: {
            identificatie: regeltekst.vastgesteld?.identificatie || regeltekst.ontwerp?.identificatie,
            technischId: regeltekst.ontwerp?.technischId,
            elementId,
          },
          typeRegelgeving: mapTypeRegelgeving(regeltekst.vastgesteld || regeltekst.ontwerp, regelgevingtypes),
          themas:
            regeltekst.vastgesteld?.thema?.map(thema => ({
              naam: thema.waarde,
              identificatie: thema.code,
            })) ||
            regeltekst.ontwerp?.thema?.map(thema => ({
              naam: thema.waarde,
              identificatie: thema.code,
            })),
          vastgesteld: {
            locatiesHref:
              regeltekst.vastgesteld?._links.heeftWerkingIn?.href ||
              regeltekst.ontwerp?._links.heeftWerkingInVastgesteld?.href,
            activiteitenHref:
              regeltekst.vastgesteld?._links.beschrijftActiviteiten?.href ||
              regeltekst.ontwerp?._links.beschrijftActiviteitenVastgesteld?.href,
            omgevingswaardenHref:
              regeltekst.vastgesteld?._links.beschrijftOmgevingswaarden?.href ||
              regeltekst.ontwerp?._links.beschrijftOmgevingswaardenVastgesteld?.href,
            omgevingsnormenHref:
              regeltekst.vastgesteld?._links.beschrijftOmgevingsnormen?.href ||
              regeltekst.ontwerp?._links.beschrijftOmgevingsnormenVastgesteld?.href,
            gebiedsaanwijzingenHref:
              regeltekst.vastgesteld?._links.beschrijftGebiedsaanwijzingen?.href ||
              regeltekst.ontwerp?._links.beschrijftGebiedsaanwijzingenVastgesteld?.href,
            kaartenHref:
              regeltekst.vastgesteld?._links.bevatKaarten?.href ||
              regeltekst.ontwerp?._links.bevatKaartenVastgesteld?.href,
            idealisatieHref: regeltekst.vastgesteld?._links.heeftWerkingInIndicatief?.href,
          },
          ontwerp: regeltekst.ontwerp
            ? {
                locatiesHref: regeltekst.ontwerp._links.heeftWerkingIn?.href,
                activiteitenHref: regeltekst.ontwerp._links.beschrijftActiviteiten?.href,
                omgevingswaardenHref: regeltekst.ontwerp._links.beschrijftOmgevingswaarden?.href,
                omgevingsnormenHref: regeltekst.ontwerp._links.beschrijftOmgevingsnormen?.href,
                gebiedsaanwijzingenHref: regeltekst.ontwerp._links.beschrijftGebiedsaanwijzingen?.href,
                kaartenHref: regeltekst.ontwerp._links.bevatKaarten?.href,
              }
            : undefined,
        }
      : undefined;
  });

export const selectRegeltekstByDocumentIdAndElementId = (
  documentId: string,
  elementId: string
): MemoizedSelector<State, RegeltekstEntity> =>
  createSelector(
    selectRegelteksten,
    (regeltekst): RegeltekstEntity =>
      regeltekst?.find(x => x.documentIdentificatie === documentId && x.elementId === elementId)
  );

const mapTypeRegelgeving = (
  regeltekst: Regeltekst | OntwerpRegeltekst,
  regelgevingtypes: RegelgevingtypeFilter[]
): string => {
  const type = regeltekst.typeJuridischeRegels;
  if (type) {
    let suffix: string[] = [];

    if (regeltekst.instructieregelInstrument?.length) {
      const mapping = regelgevingtypes.find(x => x.id === 'instructieregelInstrument')?.items;
      suffix = suffix.concat(
        mapping?.filter(x => regeltekst.instructieregelInstrument.some(item => item.code === x.id)).map(x => x.name)
      );
    }
    if (regeltekst.instructieregelTaakuitoefening?.length) {
      const mapping = regelgevingtypes.find(x => x.id === 'instructieregelTaakuitoefening')?.items;
      suffix = suffix.concat(
        mapping
          ?.filter(x => regeltekst.instructieregelTaakuitoefening.some(item => item.code === x.id))
          .map(x => x.name)
      );
    }

    if (suffix.length) {
      return `${type} voor ${suffix.join(', ')}`;
    }
    return type;
  }
  return undefined;
};
