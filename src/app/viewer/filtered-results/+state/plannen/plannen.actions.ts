import { createAction, props } from '@ngrx/store';
import { Plan } from '~ihr-model/plan';
import { Regeling } from '~ozon-model/regeling';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { FilterOptions } from '~viewer/filter/types/filter-options';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { LocatieIdType } from '~general/utils/filter.utils';

export const load = createAction('[Plannen] Load');

/* IHR Plannen */
export const ihrLoading = createAction('[Plannen] IHR Loading', props<{ bestuurslaag: Bestuurslaag }>());
export const ihrLoadError = createAction(
  '[Plannen] IHR LoadError',
  props<{ error: Error; bestuurslaag?: Bestuurslaag }>()
);
export const ihrLoadSuccess = createAction(
  '[Plannen] IHR LoadSuccess',
  props<{ ihrPlannen: Plan[]; bestuurslaag?: Bestuurslaag }>()
);
export const ihrSetNextUrl = createAction(
  '[Plannen] IHR set NextUrl',
  props<{ bestuurslaag?: Bestuurslaag; href: string }>()
);
export const ihrLoadMore = createAction(
  '[Plannen] IHR LoadMore',
  props<{ href: string; bestuurslaag?: Bestuurslaag }>()
);
export const ihrLoadMoreSuccess = createAction(
  '[Plannen] IHR LoadMoreSuccess',
  props<{ ihrPlannen: Plan[]; bestuurslaag?: Bestuurslaag }>()
);

/* Ozon (Vastgestelde) Regelingen */
export const ozonLoading = createAction('[Plannen] Ozon Loading', props<{ loadMore: boolean }>());
export const ozonLoadError = createAction('[Plannen] Ozon LoadError', props<{ error: Error }>());
export const ozonLoadSuccess = createAction(
  '[Plannen] Ozon LoadSuccess',
  props<{ regelingen: Regeling[]; omgevingsvergunningen: Omgevingsvergunning[] }>()
);
export const ozonLoadMore = createAction(
  '[Plannen] Ozon LoadMore',
  props<{ fetchUrl: string; ozonLocaties: string[]; filterOptions: FilterOptions }>()
);
export const ozonLoadMoreSuccess = createAction('[Plannen] Ozon LoadMoreSuccess', props<{ regelingen: Regeling[] }>());

/* Ozon Omgevingsvergunningen */
export const ozonOmgevingsvergunningLoadMore = createAction(
  '[Plannen] Ozon Omgevingsvergunning LoadMore',
  props<{ fetchUrl: string; ozonLocaties: string[]; filterOptions: FilterOptions }>()
);
export const ozonOmgevingsvergunningLoadMoreSuccess = createAction(
  '[Plannen] Ozon Omgevingsvergunning LoadMoreSuccess',
  props<{ omgevingsvergunningen: Omgevingsvergunning[] }>()
);

/* Ozon OntwerpRegelingen */
export const ozonOntwerpLoading = createAction('[Plannen] Ozon Ontwerp Loading', props<{ loadMore: boolean }>());
export const ozonOntwerpLoadError = createAction('[Plannen] Ozon Ontwerp LoadError', props<{ error: Error }>());
export const ozonOntwerpLoadSuccess = createAction(
  '[Plannen] Ozon Ontwerp LoadSuccess',
  props<{ ontwerpRegelingen: OntwerpRegeling[] }>()
);
export const ozonOntwerpLoadMore = createAction(
  '[Plannen] Ozon Ontwerp LoadMore',
  props<{
    fetchUrl: string;
    locatieIdType: LocatieIdType;
    locatieIds: string[];
    filterOptions: FilterOptions;
  }>()
);
export const ozonOntwerpLoadMoreSuccess = createAction(
  '[Plannen] Ozon Ontwerp LoadMoreSuccess',
  props<{ ontwerpRegelingen: OntwerpRegeling[] }>()
);

export const toggleSection = createAction(
  '[Plannen] Toggle Section',
  props<{ bestuurslaag: Bestuurslaag; open: boolean }>()
);

export const reset = createAction('[Plannen] reset');
export const setNotDirty = createAction('[Plannen] Set Not Dirty');
