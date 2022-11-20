import { ActiviteitenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { uniqueObjects } from '~general/utils/array.utils';
import { DerivedLoadingState, derivedLoadingState } from '~general/utils/store.utils';
import { Activiteit } from '~ozon-model/activiteit';
import { activiteitenKey, State } from '~store/state';

export const getActiviteitenStatus = (state: State): DerivedLoadingState =>
  derivedLoadingState(state[activiteitenKey].status);

export const selectActiviteitenGroepen = (state: State): ActiviteitenGroepVM[] => {
  if (!state[activiteitenKey]?.data) {
    return [];
  }

  // Genereer unieke groepen op basis van de activiteiten
  const uniqueGroups: ActiviteitenGroepVM[] = uniqueObjects(
    state[activiteitenKey].data.map(item => item.groep),
    'code'
  );

  return uniqueGroups.map((group: ActiviteitenGroepVM) => {
    const relatedItems: Activiteit[] = state[activiteitenKey].data.filter(
      (item: Activiteit) => item.groep.code === group.code
    );
    return {
      code: group.code,
      waarde: group.waarde,
      activiteiten: relatedItems.map((item: Activiteit) => ({
        identificatie: item.identificatie,
        naam: item.naam,
      })),
    };
  });
};
