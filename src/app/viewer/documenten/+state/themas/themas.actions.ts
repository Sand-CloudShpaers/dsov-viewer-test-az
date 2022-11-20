import { createAction, props } from '@ngrx/store';
import { Thema } from '~ozon-model/thema';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

export const load = createAction('[Ozon Thema] Load', props<{ document: DocumentDto }>());
export const loading = createAction('[Ozon Thema] Loading', props<{ document: DocumentDto }>());
export const loadSuccess = createAction(
  '[Ozon Thema] Load Success',
  props<{ document: DocumentDto; themas: Thema[] }>()
);
export const loadFailure = createAction(
  '[Ozon Thema]] Load Failure',
  props<{ document: DocumentDto; error?: Error }>()
);
