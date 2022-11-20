import { createAction, props } from '@ngrx/store';
import { GerelateerdePlannenEntity } from './gerelateerde-plannen.reducer';

export const loadGerelateerdePlannen = createAction(
  '[IHR Gerelateerde Plannen] Load gerelateerde plannen',
  props<{ documentId: string }>()
);

export const loading = createAction(
  '[IHR Gerelateerde Plannen] Loading gerelateerde plannen',
  props<{ documentId: string }>()
);

export const loadGerelateerdePlannenSuccess = createAction(
  '[IHR Gerelateerde Plannen] Load gerelateerde plannen Success',
  props<{ documentId: string; entity: GerelateerdePlannenEntity }>()
);

export const loadGerelateerdePlannenFailure = createAction(
  '[IHR Gerelateerde Plannen] Load gerelateerde plannen Failure',
  props<{ documentId: string; error?: Error }>()
);
