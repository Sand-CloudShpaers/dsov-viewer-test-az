import { createAction, props } from '@ngrx/store';
import { BekendmakingCollectie } from '~ihr-model/bekendmakingCollectie';

export const loadIhrBekendmakingen = createAction(
  '[IHR Bekendmakingen] Load IHR bekendmakingen',
  props<{ documentId: string }>()
);

export const loading = createAction('[IHR Bekendmakingen] Loading IHR bekendmakingen', props<{ documentId: string }>());

export const loadIhrBekendmakingenSuccess = createAction(
  '[IHR Bekendmakingen] Load IHR bekendmakingen Success',
  props<{ documentId: string; data?: BekendmakingCollectie }>()
);

export const loadIhrBekendmakingenFailure = createAction(
  '[IHR Bekendmakingen] Load IHR bekendmakingen Failure',
  props<{ documentId: string; error?: Error }>()
);
