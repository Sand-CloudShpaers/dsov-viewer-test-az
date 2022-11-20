import { createAction, props } from '@ngrx/store';
import { GebiedsaanwijzingenEmbedded } from '~ozon-model/gebiedsaanwijzingenEmbedded';
import { Href } from '~ozon-model/href';

export const loadGebiedsaanwijzingen = createAction(
  '[Gebieden Gebiedsaanwijzingen] Load',
  props<{ gebiedsaanwijzingen: GebiedsaanwijzingenEmbedded; href?: Href }>()
);

export const loadGebiedsaanwijzingenSuccess = createAction(
  '[Gebieden Gebiedsaanwijzingen] Load Success',
  props<{ gebiedsaanwijzingen: GebiedsaanwijzingenEmbedded }>()
);

export const loadGebiedsaanwijzingenFailure = createAction(
  '[Gebieden Gebiedsaanwijzingen] Load Failure',
  props<{ error: Error }>()
);
