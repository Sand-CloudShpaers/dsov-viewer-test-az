import { createAction, props } from '@ngrx/store';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { HoofdlijnenEntity } from './hoofdlijnen.model';

export const loadHoofdlijnen = createAction('[Ozon Hoofdlijnen] Load', props<{ document: DocumentDto }>());

export const loadingHoofdlijnen = createAction(
  '[Ozon Hoofdlijnen] Loading',
  props<{
    document: DocumentDto;
  }>()
);

export const loadHoofdlijnenSuccess = createAction('[Ozon Hoofdlijnen] Load Success', props<HoofdlijnenEntity>());

export const loadHoofdlijnenFailure = createAction(
  '[Ozon Hoofdlijnen]] Load Failure',
  props<{ documentId: string; error: Error }>()
);
