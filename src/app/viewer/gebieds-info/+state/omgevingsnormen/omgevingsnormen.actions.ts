import { createAction, props } from '@ngrx/store';
import { Href } from '~ozon-model/href';
import { Omgevingsnorm } from '~ozon-model/omgevingsnorm';

export const loadOmgevingsnormen = createAction(
  '[Gebieden Omgevingsnormen] Load',
  props<{ omgevingsnormen: Omgevingsnorm[]; href?: Href }>()
);

export const loadingOmgevingsnormen = createAction(
  '[Gebieden Omgevingsnormen] Loading',
  props<{ omgevingsnormen: Omgevingsnorm[]; href?: Href }>()
);

export const loadOmgevingsnormenSuccess = createAction(
  '[Gebieden Omgevingsnormen] Load Success',
  props<{ omgevingsnormen: Omgevingsnorm[] }>()
);

export const loadOmgevingsnormenFailure = createAction(
  '[Gebieden Omgevingsnormen] Load Failure',
  props<{ error: Error }>()
);
