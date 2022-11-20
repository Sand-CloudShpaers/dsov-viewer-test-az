import { createAction, props } from '@ngrx/store';
import { Locatie } from '~ozon-model/locatie';
import { OntwerpLocatie } from '~ozon-model/ontwerpLocatie';

export const load = createAction(
  '[Annotaties] activiteitLocatieaanduidingen uitklappen',
  props<{ id: string; href: string }>()
);
export const loading = createAction('[Annotaties] Aanduiding Locaties laden', props<{ id: string; href: string }>());
export const loadError = createAction(
  '[Annotaties] Aanduiding Locaties laden Error',
  props<{ error: Error; id: string }>()
);

export const loadSuccess = createAction(
  '[Annotaties] Aanduiding locaties laden succesvol',
  props<{ locaties: (Locatie | OntwerpLocatie)[]; id: string }>()
);
