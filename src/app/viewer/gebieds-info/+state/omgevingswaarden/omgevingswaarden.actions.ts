import { createAction, props } from '@ngrx/store';
import { Href } from '~ozon-model/href';
import { Omgevingswaarde } from '~ozon-model/omgevingswaarde';

export const loadOmgevingswaarden = createAction(
  '[Gebieden Omgevingswaarden] Load',
  props<{ omgevingswaarden: Omgevingswaarde[]; href?: Href }>()
);

export const loadOmgevingswaardenSuccess = createAction(
  '[Gebieden Omgevingswaarden] Load Success',
  props<{ omgevingswaarden: Omgevingswaarde[] }>()
);

export const loadOmgevingswaardenFailure = createAction(
  '[Gebieden Omgevingswaarden] Load Failure',
  props<{ error: Error }>()
);
