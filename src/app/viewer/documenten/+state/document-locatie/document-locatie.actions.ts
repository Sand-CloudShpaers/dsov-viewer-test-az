import { createAction, props } from '@ngrx/store';
import { LocatieMetBoundingBox } from '~ozon-model/locatieMetBoundingBox';

export const load = createAction('[Document Locatie] Load', props<{ documentId: string; href: string }>());
export const loading = createAction('[Document Locatie] Loading', props<{ documentId: string; href: string }>());
export const loadingSuccess = createAction(
  '[Document Locatie] Loading Success',
  props<{ documentId: string; locatie?: LocatieMetBoundingBox }>()
);
export const loadingFailure = createAction(
  '[Document Locatie] Loading Failure',
  props<{ documentId: string; error?: Error }>()
);
