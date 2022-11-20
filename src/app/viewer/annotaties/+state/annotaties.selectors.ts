import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectAnnotatiesState, State } from './index';
import * as fromLocaties from './locaties/locaties.reducer';
import * as fromActiviteitLocatieaanduidingen from './activiteit-locatieaanduidingen/activiteit-locatieaanduidingen.reducer';
import * as fromAanduidingLocaties from './aanduiding-locaties/aanduiding-locaties.reducer';
import * as fromGebiedsaanwijzingen from './gebiedsaanwijzingen/gebiedsaanwijzingen.reducer';
import * as fromOmgevingsnormen from './omgevingsnormen/omgevingsnormen.reducer';
import * as fromOmgevingswaarden from './omgevingswaarden/omgevingswaarden.reducer';
import * as fromHoofdlijnen from './hoofdlijnen/hoofdlijnen.reducer';
import * as fromKaarten from './kaarten/kaarten.reducer';
import * as fromIdealisatie from './idealisatie/idealisatie.reducer';
import * as fromBestemmingsplanFeatures from './bestemminsplan-features/bestemmingsplan-features.reducer';
import { OmgevingsnormenVM } from '~viewer/normen/types/omgevingsnormenVM';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { GebiedsaanwijzingenVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import {
  AanduidingLocatiesVM,
  ActiviteitLocatieaanduidingenGroepVM,
} from '~viewer/gebieds-info/types/gebieds-info.model';
import { deepGroupBy, sortByKey, sortGroupByKeys } from '~general/utils/group-by.utils';
import { AnnotatieHoofdlijnenVM, AnnotatieHoofdlijnVM } from '~viewer/annotaties/types/hoofdlijnen';
import { EntityPayload } from '~general/utils/state/entity-action';
import { Locatie } from '~ozon-model/locatie';
import { getGebiedsaanwijzingenVMArray } from '~viewer/gebiedsaanwijzingen/helpers/gebiedsaanwijzingen';
import { getOmgevingsnormenArray } from '~viewer/annotaties/helpers/omgevingsnormen';
import { NormType } from '~viewer/annotaties/types/annotaties-enums';
import {
  ActiviteitLocatieaanduidingenEntity,
  GebiedsaanwijzingenEntity,
  OmgevingsnormenEntity,
  OmgevingswaardenEntity,
} from '../types/entity';
import { LocatieVM } from '../types/locatieVM';
import { KaartVM } from '../types/kaartenVM';
import { OntwerpLocatie } from '~ozon-model/ontwerpLocatie';
import { ActiviteitLocatieaanduiding } from '~ozon-model/activiteitLocatieaanduiding';
import { Activiteit } from '~ozon-model/activiteit';
import { OntwerpActiviteit } from '~ozon-model/ontwerpActiviteit';
import { OntwerpActiviteitLocatieaanduiding } from '~ozon-model/ontwerpActiviteitLocatieaanduiding';
import { uniqueObjects } from '~general/utils/array.utils';
import { selectSelections } from '~store/common/selection/+state/selection.selectors';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { OntwerpKaart } from '~ozon-model/ontwerpKaart';
import { getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { BestemmingsplanFeatureGroupVM } from '../types/bestemmingsplan-features';
import { Bestemmingsvlak } from '~ihr-model/bestemmingsvlak';
import { Gebiedsaanduiding } from '~ihr-model/gebiedsaanduiding';
import { Functieaanduiding } from '~ihr-model/functieaanduiding';
import { Bouwaanduiding } from '~ihr-model/bouwaanduiding';
import { Maatvoering } from '~ihr-model/maatvoering';
import { AnnotationId } from '~viewer/documenten/types/annotation';
import { getAnnotationEntityId } from '../helpers/annotaties';

const { selectEntities: selectActiviteitLocatieaanduidingen } =
  fromActiviteitLocatieaanduidingen.adapter.getSelectors();
const { selectEntities: selectAanduidingLocaties } = fromAanduidingLocaties.adapter.getSelectors();
const { selectEntities: selectLocaties } = fromLocaties.adapter.getSelectors();
const { selectEntities: selectGebiedsaanwijzingen } = fromGebiedsaanwijzingen.adapter.getSelectors();
const { selectEntities: selectOmgevingsnormen } = fromOmgevingsnormen.adapter.getSelectors();
const { selectEntities: selectOmgevingswaarden } = fromOmgevingswaarden.adapter.getSelectors();
const { selectEntities: selectHoofdlijnen } = fromHoofdlijnen.adapter.getSelectors();
const { selectEntities: selectKaarten } = fromKaarten.adapter.getSelectors();
const { selectEntities: selectIdealisatie } = fromIdealisatie.adapter.getSelectors();
const { selectEntities: selectBestemmingsplanFeatures } = fromBestemmingsplanFeatures.adapter.getSelectors();

const getActiviteitLocatieaanduidingState = createSelector(
  selectAnnotatiesState,
  state => state[fromActiviteitLocatieaanduidingen.activiteitLocatieaanduidingenRootKey]
);

const getActiviteitLocatieaanduidingen = createSelector(
  getActiviteitLocatieaanduidingState,
  selectActiviteitLocatieaanduidingen
);

export const getActiviteitLocatieaanduidingenById = (
  annotationId: AnnotationId
): MemoizedSelector<State, EntityPayload<ActiviteitLocatieaanduidingenEntity>> =>
  createSelector(
    getActiviteitLocatieaanduidingen,
    activiteitLocatieaanduidingen => activiteitLocatieaanduidingen[getAnnotationEntityId(annotationId)]
  );

export const getActiviteitLocatieaanduidingenStatusById = (
  annotationId: AnnotationId
): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getActiviteitLocatieaanduidingenById(annotationId), entity =>
    entity?.status ? derivedLoadingState(entity.status) : null
  );

export const selectActiviteitLocatieaanduidingenById = (
  annotationId: AnnotationId
): MemoizedSelector<State, ActiviteitLocatieaanduidingenGroepVM[]> =>
  createSelector(getActiviteitLocatieaanduidingenById(annotationId), selectSelections, (entityPayload, selections) => {
    if (!entityPayload?.data) {
      return [];
    }

    const vastgesteld = entityPayload?.data.vastgesteld?._embedded.activiteitlocatieaanduidingen || [];
    const ontwerp = entityPayload?.data.ontwerp?._embedded.activiteitlocatieaanduidingen || [];

    return getActiviteitLocatieaanduidingenArray(vastgesteld, ontwerp, selections);
  });

const getAanduidingLocatiesState = createSelector(
  selectAnnotatiesState,
  state => state[fromAanduidingLocaties.aanduidingLocatiesRootKey]
);

const getAanduidingLocaties = createSelector(getAanduidingLocatiesState, selectAanduidingLocaties);

export const getAanduidingLocatiesById = (
  activiteitId: string
): MemoizedSelector<State, { id: string; locaties: (Locatie | OntwerpLocatie)[] }> =>
  createSelector(getAanduidingLocaties, aanduidingLocaties => aanduidingLocaties[activiteitId]?.data);

export const getAanduidingLocatiesByIds = (ids: string[]): MemoizedSelector<State, AanduidingLocatiesVM[]> =>
  createSelector(getAanduidingLocaties, aanduidingLocatieList => {
    const aanduidinglocaties: AanduidingLocatiesVM[] = [];
    for (const [key, value] of Object.entries(aanduidingLocatieList)) {
      if (ids.includes(key) && value.data) {
        aanduidinglocaties.push({
          id: value.data.id,
          locaties: value.data.locaties.map(x => ({
            identificatie: x.identificatie,
            naam: x.noemer,
            isOntwerp: false,
          })),
        });
      }
    }

    return aanduidinglocaties;
  });

const getOmgevingswaardenState = createSelector(
  selectAnnotatiesState,
  state => state[fromOmgevingswaarden.omgevingswaardenRootKey]
);
const getOmgevingswaarden = createSelector(getOmgevingswaardenState, selectOmgevingswaarden);
export const getOmgevingswaardenById = (
  annotationId: AnnotationId
): MemoizedSelector<State, EntityPayload<OmgevingswaardenEntity>> =>
  createSelector(getOmgevingswaarden, omgevingswaarden => omgevingswaarden[getAnnotationEntityId(annotationId)]);

export const getOmgevingswaardenStatusById = (
  annotationId: AnnotationId
): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getOmgevingswaardenById(annotationId), entity =>
    entity?.status ? derivedLoadingState(entity.status) : null
  );

export const selectOmgevingswaardenById = (annotationId: AnnotationId): MemoizedSelector<State, OmgevingsnormenVM[]> =>
  createSelector(getOmgevingswaardenById(annotationId), selectSelections, (entityPayload, selections) => {
    const vastgesteld = entityPayload?.data?.vastgesteld?._embedded.omgevingswaarden || [];
    const ontwerp = entityPayload?.data?.ontwerp?._embedded.ontwerpomgevingswaarden || [];
    return getOmgevingsnormenArray(vastgesteld, ontwerp, NormType.OMGEVINGSWAARDEN, selections);
  });

const getOmgevingsnormenState = createSelector(
  selectAnnotatiesState,
  state => state[fromOmgevingsnormen.omgevingsnormenRootKey]
);
const getOmgevingsnormen = createSelector(getOmgevingsnormenState, selectOmgevingsnormen);
export const getOmgevingsnormenById = (
  annotationId: AnnotationId
): MemoizedSelector<State, EntityPayload<OmgevingsnormenEntity>> =>
  createSelector(getOmgevingsnormen, omgevingsnormen => omgevingsnormen[getAnnotationEntityId(annotationId)]);

export const getOmgevingsnormenStatusById = (
  annotationId: AnnotationId
): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getOmgevingsnormenById(annotationId), entity =>
    entity?.status ? derivedLoadingState(entity.status) : null
  );

export const selectOmgevingsnormenById = (
  annotationId: AnnotationId,
  documentViewContext: DocumentViewContext
): MemoizedSelector<State, OmgevingsnormenVM[]> =>
  createSelector(
    getOmgevingsnormenById(annotationId),
    selectSelections,
    getOzonLocaties,
    (entityPayload, selections, ozonLocaties) => {
      // Alleen bij Geselecteerde regels zijn de ozon locaties nodig om de normwaarden van te filteren.
      // In de context van een volledig document worden alle normwaarden van de omgevingsnorm getoond.
      const isRegelsOpMaat = documentViewContext === DocumentViewContext.REGELS_OP_MAAT;
      const vastgesteld = entityPayload?.data?.vastgesteld?._embedded.omgevingsnormen || [];
      const ontwerp = entityPayload?.data?.ontwerp?._embedded.ontwerpomgevingsnormen || [];
      return getOmgevingsnormenArray(
        vastgesteld,
        ontwerp,
        NormType.OMGEVINGSNORMEN,
        selections,
        isRegelsOpMaat ? ozonLocaties : undefined
      );
    }
  );

const getGebiedsaanwijzingenState = createSelector(
  selectAnnotatiesState,
  state => state[fromGebiedsaanwijzingen.gebiedsaanwijzingenRootKey]
);
const getGebiedsaanwijzingen = createSelector(getGebiedsaanwijzingenState, selectGebiedsaanwijzingen);
export const getGebiedsaanwijzingenById = (
  annotationId: AnnotationId
): MemoizedSelector<State, EntityPayload<GebiedsaanwijzingenEntity>> =>
  createSelector(
    getGebiedsaanwijzingen,
    gebiedsaanwijzingen => gebiedsaanwijzingen[getAnnotationEntityId(annotationId)]
  );

export const getGebiedsaanwijzingenStatusById = (
  annotationId: AnnotationId
): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getGebiedsaanwijzingenById(annotationId), entity =>
    entity?.status ? derivedLoadingState(entity.status) : null
  );

export const selectGebiedsaanwijzingenById = (
  annotationId: AnnotationId
): MemoizedSelector<State, GebiedsaanwijzingenVM[]> =>
  createSelector(getGebiedsaanwijzingenById(annotationId), selectSelections, (entityPayload, selection) => {
    const vastgesteld = entityPayload?.data?.vastgesteld?._embedded;
    const ontwerp = entityPayload?.data?.ontwerp?._embedded;
    return getGebiedsaanwijzingenVMArray(selection, vastgesteld, ontwerp);
  });

const getBestemmingsplanFeaturesState = createSelector(
  selectAnnotatiesState,
  state => state[fromBestemmingsplanFeatures.bestemmingsplanFeaturesRootKey]
);
export const getBestemmingsplanFeatures = createSelector(
  getBestemmingsplanFeaturesState,
  selectBestemmingsplanFeatures
);

export const getBestemmingsplanFeaturesStatusById = (
  annotationId: AnnotationId
): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getBestemmingsplanFeatures, entities =>
    entities[getAnnotationEntityId(annotationId)]?.status
      ? derivedLoadingState(entities[getAnnotationEntityId(annotationId)].status)
      : null
  );

export const getBestemmingsplanFeaturesById = (
  annotationId: AnnotationId
): MemoizedSelector<State, BestemmingsplanFeatureGroupVM[]> =>
  createSelector(getBestemmingsplanFeatures, selectSelections, (entities, selections) => {
    if (entities[getAnnotationEntityId(annotationId)]) {
      const objectTypes = uniqueObjects(entities[getAnnotationEntityId(annotationId)].data, 'objectType');

      const output: BestemmingsplanFeatureGroupVM[] = objectTypes.map(group => {
        const filtered = entities[getAnnotationEntityId(annotationId)].data.filter(
          item => item.objectType === group.objectType
        );
        return {
          id: group.objectType,
          objectType: group.objectType,
          features: filtered
            .map(item => ({
              id: item.feature.id,
              naam: item.feature.naam,
              symboolcode: getIHRSymboolCode(item.feature, item.objectType),
              isSelected: !!selections?.find(s => s.id === item.feature.id),
              locatieIds: filtered.map(x => x.feature.id),
            }))
            .filter((_, index) => index === 0),
        };
      });
      return output;
    }
    return undefined;
  });

const getLocatiesState = createSelector(selectAnnotatiesState, state => state[fromLocaties.locatiesRootKey]);
const getLocaties = createSelector(getLocatiesState, selectLocaties);
export const getLocatiesById = (annotationId: AnnotationId): MemoizedSelector<State, LocatieVM[]> =>
  createSelector(getLocaties, selectSelections, (entities, selections) => {
    const output: LocatieVM[] = [];
    const data = entities[getAnnotationEntityId(annotationId)]?.data;
    [data?.vastgesteld?._embedded.locaties, data?.ontwerp?._embedded.ontwerpLocaties].forEach((locaties, index) => {
      const isOntwerp = index === 1;
      locaties?.forEach(locatie => {
        const identificatie = isOntwerp ? (locatie as OntwerpLocatie).technischId : locatie.identificatie;
        const selection = selections?.find(x => x.id === identificatie);
        output.push({
          identificatie,
          naam: locatie.noemer || '',
          isSelected: !!selection,
          symboolcode: 'werkingsgebied',
          isOntwerp,
        });
      });
    });

    output.sort((a, b) => (a.naam > b.naam ? 1 : b.naam > a.naam ? -1 : 0));

    return output;
  });

export const getLocatiesStatusById = (annotationId: AnnotationId): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getLocaties, entities =>
    entities[getAnnotationEntityId(annotationId)]?.status
      ? derivedLoadingState(entities[getAnnotationEntityId(annotationId)].status)
      : null
  );

const getHoofdlijnenState = createSelector(selectAnnotatiesState, state => state[fromHoofdlijnen.hoofdlijnenRootKey]);
const getHoofdlijnen = createSelector(getHoofdlijnenState, selectHoofdlijnen);
export const getHoofdlijnenById = (annotationId: AnnotationId): MemoizedSelector<State, AnnotatieHoofdlijnenVM[]> =>
  createSelector(getHoofdlijnen, (entities): AnnotatieHoofdlijnenVM[] => {
    const vastgesteld = entities[getAnnotationEntityId(annotationId)]?.data?.vastgesteld?._embedded.hoofdlijnen || [];
    const ontwerp = entities[getAnnotationEntityId(annotationId)]?.data?.ontwerp?._embedded.ontwerphoofdlijnen || [];
    const merged: AnnotatieHoofdlijnVM[] = [];
    [vastgesteld, ontwerp].forEach((list, index) => {
      list.forEach(hoofdlijn => {
        merged.push({
          identificatie: hoofdlijn.identificatie,
          naam: hoofdlijn.naam,
          soort: hoofdlijn.soort,
          isOntwerp: index === 1,
        });
      });
    });
    const sorted = sortByKey<AnnotatieHoofdlijnVM>(merged, 'naam');
    const grouped = deepGroupBy<AnnotatieHoofdlijnVM, keyof AnnotatieHoofdlijnVM>(sorted, 'soort');
    const sortedGroups = sortGroupByKeys<AnnotatieHoofdlijnVM>(grouped);
    return Object.keys(sortedGroups).map(key => ({
      identificatie: key,
      naam: key,
      hoofdlijnen: sortedGroups[key],
    }));
  });

export const getHoofdlijnenStatusById = (id: string): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getHoofdlijnen, entities => (entities[id]?.status ? derivedLoadingState(entities[id].status) : null));

const getKaartenState = createSelector(selectAnnotatiesState, state => state[fromKaarten.kaartenRootKey]);
const getKaarten = createSelector(getKaartenState, selectKaarten);
export const getKaartenById = (annotationId: AnnotationId): MemoizedSelector<State, KaartVM[]> =>
  createSelector(getKaarten, selectSelections, (entities, selections): KaartVM[] => {
    const vastgesteld = entities[getAnnotationEntityId(annotationId)]?.data.vastgesteld?._embedded.kaarten || [];
    const ontwerp = entities[getAnnotationEntityId(annotationId)]?.data.ontwerp?._embedded.ontwerpkaarten || [];
    const merged: KaartVM[] = [];
    [vastgesteld, ontwerp].forEach((list, index) => {
      list.forEach(kaart => {
        merged.push({
          identificatie: (kaart as OntwerpKaart).technischId || kaart.identificatie,
          naam: kaart.naam,
          nummer: kaart.nummer,
          isOntwerp: index === 1,
          kaartlagen: kaart.bevat.map(laag => {
            const selection = selections?.find(x => x.id === laag.identificatie);
            return {
              identificatie: laag.identificatie,
              naam: laag.naam,
              niveau: laag.niveau,
              symboolcode: selection?.symboolcode,
              isSelected: !!selection,
            };
          }),
        });
      });
    });

    // kaarten sorteren op nummer
    if (merged?.length > 1) {
      merged.sort((a, b) => (a.nummer > b.nummer ? 1 : b.nummer > a.nummer ? -1 : 0));
    }
    return merged;
  });

export const getKaartenStatusById = (annotationId: AnnotationId): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getKaarten, entities =>
    entities[getAnnotationEntityId(annotationId)]?.status
      ? derivedLoadingState(entities[getAnnotationEntityId(annotationId)].status)
      : null
  );

const getIdealisatieState = createSelector(selectAnnotatiesState, state => state[fromIdealisatie.featureKey]);
const getIdealisatie = createSelector(getIdealisatieState, selectIdealisatie);
export const getIdealisatieById = (annotationId: AnnotationId): MemoizedSelector<State, boolean> =>
  createSelector(
    getIdealisatie,
    (entities): boolean => !!entities[getAnnotationEntityId(annotationId)]?.data?._embedded.locaties.length
  );
export const getIdealisatieStatusById = (annotationId: AnnotationId): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getIdealisatie, entities =>
    entities[getAnnotationEntityId(annotationId)]?.status
      ? derivedLoadingState(entities[getAnnotationEntityId(annotationId)].status)
      : null
  );

export const getAnnotatiesStatusById = (annotationId: AnnotationId): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(
    getIdealisatieStatusById(annotationId),
    getLocatiesStatusById(annotationId),
    getGebiedsaanwijzingenStatusById(annotationId),
    getOmgevingswaardenStatusById(annotationId),
    getOmgevingsnormenStatusById(annotationId),
    getActiviteitLocatieaanduidingenStatusById(annotationId),
    getKaartenStatusById(annotationId),
    getHoofdlijnenStatusById(getAnnotationEntityId(annotationId)),
    getBestemmingsplanFeaturesStatusById(annotationId),
    (
      idealisatieStatus,
      locatieStatus,
      gebiedsaanwijzingStatus,
      omgevingswaardenStatus,
      omgevingsnormenStatus,
      activiteitLocatieaanduidingenStatus,
      kaartenStatus,
      hoofdlijnenStatus,
      bpFeaturesStatus
    ) => {
      const states = [
        idealisatieStatus,
        locatieStatus,
        gebiedsaanwijzingStatus,
        omgevingswaardenStatus,
        omgevingsnormenStatus,
        activiteitLocatieaanduidingenStatus,
        kaartenStatus,
        hoofdlijnenStatus,
        bpFeaturesStatus,
      ].filter(s => s !== null);
      if (states.length > 0) {
        return {
          isLoading: states.some(x => x.isLoading),
          isLoaded: states.some(x => x.isLoaded),
          isIdle: states.some(x => x.isIdle),
          isPending: states.some(x => x.isPending),
          isResolved: states.every(x => x.isResolved),
          isRejected: states.some(x => x.isRejected),
        };
      }
      return null;
    }
  );

interface Aanduiding {
  identificatie: string;
  regelkwalificatie: string;
  activiteit: Activiteit | OntwerpActiviteit;
  kwalificeertHref: string;
  isOntwerp: boolean;
}

const getActiviteitLocatieaanduidingenArray = (
  vastgesteld: ActiviteitLocatieaanduiding[],
  ontwerp: OntwerpActiviteitLocatieaanduiding[],
  selections: Selection[]
): ActiviteitLocatieaanduidingenGroepVM[] => {
  const aanduidingen: Aanduiding[] = [];
  vastgesteld.forEach(aanduiding => {
    if (aanduiding.betreftEenActiviteit) {
      aanduidingen.push({
        identificatie: aanduiding.identificatie,
        activiteit: aanduiding.betreftEenActiviteit,
        regelkwalificatie: aanduiding.activiteitregelkwalificatie?.waarde,
        kwalificeertHref: aanduiding._links?.kwalificeert?.href,
        isOntwerp: false,
      });
    }
  });

  ontwerp.forEach(aanduiding => {
    if (aanduiding.betreftEenActiviteit || aanduiding.betreftEenActiviteitVastgesteld) {
      aanduidingen.push({
        identificatie: aanduiding.identificatie,
        activiteit: aanduiding.betreftEenActiviteit || aanduiding.betreftEenActiviteitVastgesteld,
        regelkwalificatie: aanduiding.activiteitregelkwalificatie?.waarde,
        kwalificeertHref: aanduiding._links?.kwalificeert?.href,
        isOntwerp: true,
      });
    }
  });

  // Genereer unieke groepen op basis van de activiteit locatie aanduidingen
  const uniqueGroups: ActiviteitLocatieaanduidingenGroepVM[] = uniqueObjects(
    aanduidingen.map(item => item.activiteit?.groep),
    'code'
  );
  // De gerelateerde locatieaanduidingen moeten in groepen worden geplaatst en ge-mapped naar view models
  return uniqueGroups.map((group: ActiviteitLocatieaanduidingenGroepVM) => {
    const relatedItems = aanduidingen.filter((item: Aanduiding) => item.activiteit.groep.code === group.code);
    return {
      code: group.code,
      waarde: group.waarde,
      activiteitLocatieaanduidingen: relatedItems.map((item: Aanduiding) => {
        const identificatie = item.identificatie;
        const selection = selections?.find(x => x.id === identificatie);
        return {
          identificatie,
          naam: item.activiteit.naam,
          regelkwalificatie: item.regelkwalificatie,
          kwalificeertHref: item.kwalificeertHref,
          isSelected: !!selection,
          isOntwerp: item.isOntwerp,
          symboolcode: selection?.symboolcode,
        };
      }),
    };
  });
};

const getIHRSymboolCode = (
  feature: Bestemmingsvlak | Gebiedsaanduiding | Functieaanduiding | Bouwaanduiding | Maatvoering,
  objectType: SelectionObjectType
): string => {
  switch (objectType) {
    case SelectionObjectType.BESTEMMINGSVLAK:
      return `${(feature as Bestemmingsvlak).type}_${(feature as Bestemmingsvlak).bestemmingshoofdgroep}`
        .split(' ')
        .join('_');
    case SelectionObjectType.GEBIEDSAANDUIDING:
      return `gebiedsaanduiding_${(feature as Gebiedsaanduiding).gebiedsaanduidinggroep}`.split(' ').join('_');
    case SelectionObjectType.FUNCTIEAANDUIDING:
      return 'functieaanduiding';
    case SelectionObjectType.MAATVOERING:
      return 'maatvoering';
    case SelectionObjectType.BOUWAANDUIDING:
      return 'bouwaanduiding';
    default:
      return objectType;
  }
};
