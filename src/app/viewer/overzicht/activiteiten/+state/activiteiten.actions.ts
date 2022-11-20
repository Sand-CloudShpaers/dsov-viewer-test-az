import { createAction, props } from '@ngrx/store';
import { Activiteit } from '~ozon-model/activiteit';
import { Href } from '~ozon-model/href';

export const loadActiviteiten = createAction('[Activiteiten] Load');

export const loadingActiviteiten = createAction(
  '[Activiteiten] Loading',
  props<{ activiteiten: Activiteit[]; href?: Href }>()
);

export const loadActiviteitenSuccess = createAction(
  '[Activiteiten] Load Success',
  props<{ activiteiten: Activiteit[] }>()
);

export const loadActiviteitenFailure = createAction('[Activiteiten] Load Failure', props<{ error: Error }>());

export const resetState = createAction('[Activiteiten] Reset state');
