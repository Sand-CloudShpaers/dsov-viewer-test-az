import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectDocumentenState, State } from '~viewer/documenten/+state';
import * as fromMapDetails from './map-details.reducer';
import {
  IhrObjectInfoLayers,
  IMROCartografieInfoDetailVM,
  IMROCartografieInfoVM,
  IMROObjectType,
} from '~viewer/documenten/types/map-details';
import { uniqueObjects } from '~general/utils/array.utils';
import { CartografieSummary } from '~ihr-model/cartografieSummary';
import { FeatureLike } from 'ol/Feature';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';

const getMapDetailsState = createSelector(selectDocumentenState, state => state[fromMapDetails.featureKey]);

export const getMapDetailsStatus = (): MemoizedSelector<State, DerivedLoadingState> =>
  createSelector(getMapDetailsState, (state): DerivedLoadingState => derivedLoadingState(state.status));

export const selectMapDetails = createSelector(getMapDetailsState, (state): IMROCartografieInfoVM[] => {
  let cartografieInfo: IMROCartografieInfoVM[];
  if (state?.cartografie?._embedded?.cartografiesummaries?.some(s => s.cartografieInfo)) {
    cartografieInfo = getInfoFromCartografieSummaries(state?.cartografie?._embedded?.cartografiesummaries);
  } else {
    cartografieInfo = getInfoFromFeatures(state?.features);
  }
  return cartografieInfo;
});

const getInfoFromCartografieSummaries = (summaries: CartografieSummary[]): IMROCartografieInfoVM[] => {
  const cartografieInfo: IMROCartografieInfoVM[] = [];

  const kaarten = summaries
    ?.map(item => item.cartografieInfo)
    .flat()
    .map(kaart => ({
      kaartnummer: kaart.kaartnummer,
      kaartnaam: kaart.kaartnaam,
    }));
  const uniqueKaarten = uniqueObjects(kaarten, 'kaartnummer');
  uniqueKaarten.sort((a, b) => a.kaartnummer - b.kaartnummer);

  uniqueKaarten.forEach(kaart => {
    let details: IMROCartografieInfoDetailVM[] = [];
    // Find cartografieInfo for each map
    summaries.forEach(s => {
      // Add details only when info has a symboolCode
      // Kaarten with multiple layers always have an entry without a symboolcode which links to the text

      if (s.cartografieInfo.find(x => x.kaartnummer === kaart.kaartnummer && x.symboolCode)) {
        const currentDetail: IMROCartografieInfoDetailVM = {
          id: s.objectId,
          naam: s.objectNaam,
          labels: [s.objectNaam],
          type: s.objectType,
          themas: s.thema,
          symboolcode: s.cartografieInfo[0].symboolCode,
          externalLinks: [...s.verwijzingNaarTekst].reverse(),
          selected: true,
          internalLinks: s?._links?.teksten
            .map(tekst => ({
              href: tekst.href,
              // Dit is niet zo'n nette oplossing om de ID uit een href te halen
              id: tekst.href.split('/teksten/')[1],
            }))
            .reverse(),
        };

        details = details.concat(currentDetail);
      }
    });
    cartografieInfo.push({ naam: kaart.kaartnaam, nummer: kaart.kaartnummer, details });
  });

  return cartografieInfo;
};

const getInfoFromFeatures = (features: FeatureLike[]): IMROCartografieInfoVM[] => {
  let cartografieInfo: IMROCartografieInfoVM[];

  const details: IMROCartografieInfoDetailVM[] = features
    // Filter de grens van het plangebied eruit
    ?.filter(feature => feature.getProperties().layer !== 'plangebied')
    // Maak een selectie object aan voor elke feature
    ?.map(feature => {
      const properties = feature.getProperties();
      const label = properties.naam || properties.classificatie || properties.type?.toLowerCase();
      return {
        categorie: properties.categorie,
        classificatie: properties.classificatie,
        naam: properties.naam,
        id: properties.objectid,
        type: properties.type,
        symboolcode: getSymboolCode(
          properties.type,
          properties.categorie,
          properties.classificatie,
          properties.layer,
          properties.naam
        ),
        labels: [label],
        selected: true,
      };
    });
  if (details.length) {
    cartografieInfo = [{ nummer: 1, naam: 'Plankaart', details }];
  }

  return cartografieInfo;
};

export const getSymboolCode = (
  type: IMROObjectType,
  categorie: IMROObjectType,
  classificatie: string,
  layer: IhrObjectInfoLayers,
  naam: string
): string => {
  // Use categorie to determine the first part of the symbol code
  // When the categorie is not set, we use the type as a fallback
  const type_string = (categorie || type).toLowerCase();
  const classificatie_string =
    classificatie !== undefined ? '_' + classificatie.split(' ').join('_').toLowerCase() : '';
  const symboolcode = type_string + classificatie_string;

  switch (layer) {
    case 'planobject_linestring':
      // Line styles are dependent on the naam of the feature
      if (naam) {
        naam = naam.split(' ').join('_');
        if (naam.includes('hartlijn_leiding')) {
          return `${symboolcode}_hartlijn_leiding`;
        }
        if (['as_van_de_weg', 'relatie', 'dwarsprofiel', 'gevellijn'].includes(naam)) {
          return `${symboolcode}_${naam}`;
        } else {
          return `${symboolcode}_overig`;
        }
      }
      return `${symboolcode}_lijn`;
    case 'planobject_point':
      // Point styles are based on the type only and are the same for each classificatie within the type
      // So we only the type to determine the symbol code
      return `${type_string}_punt`;
    default:
      return symboolcode;
  }
};
