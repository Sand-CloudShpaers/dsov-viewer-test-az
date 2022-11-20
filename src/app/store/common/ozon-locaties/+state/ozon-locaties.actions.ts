import { createAction, props } from '@ngrx/store';
import { LocatieFilter } from '~viewer/filter/types/filter-options';

export const loading = createAction(
  '[Ozon Locaties] Laden',
  props<{ activeLocation: LocatieFilter; timeTravelDate?: string }>()
);

export const loadError = createAction('[Ozon Locaties] Laden Error', props<{ error: Error }>());

export const loadSuccess = createAction(
  '[Ozon Locaties] Laden succesvol',
  props<{ locatieIds: string[]; ontwerpLocatieTechnischIds: string[]; omgevingsplanPons: boolean }>()
);

export const reset = createAction('[Ozon Locaties] Reset');
