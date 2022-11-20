import { createAction, props } from '@ngrx/store';
import { Highlight } from '../types/highlight.model';

export const load = createAction('[Highlight] Load', props<Highlight>());
export const loading = createAction('[Highlight] Loading', props<Highlight>());
export const loadingSuccess = createAction('[Highlight] Loading Success', props<Highlight>());
export const loadingFailure = createAction('[Highlight] Loading Failure', props<{ id: string; error: Error }>());
export const cancel = createAction('[Highlight] Cancel');
export const reset = createAction('[Highlight] Reset');
