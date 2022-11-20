import { createAction, props } from '@ngrx/store';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import { OntwerpDivisieannotatie } from '~ozon-model/ontwerpDivisieannotatie';

export const openedDivisieannotatieForElement = createAction(
  '[Ozon Divisieannotatie] Opened for Element',
  props<{ documentId: string; documentstructuurelementId: string; href: string; isOntwerp: boolean }>()
);

export const loadDivisieannotatie = createAction(
  '[Ozon Divisieannotatie] Load',
  props<{ documentstructuurelementId: string; href: string; isOntwerp: boolean }>()
);

export const loadDivisieannotatieSuccess = createAction(
  '[Ozon Divisieannotatie] Load Success',
  props<{ documentstructuurelementId: string; vastgesteld?: Divisieannotatie; ontwerp?: OntwerpDivisieannotatie }>()
);

export const loadDivisieannotatieFailure = createAction(
  '[Ozon Divisieannotatie] Load Failure',
  props<{ documentstructuurelementId: string; error?: Error }>()
);
