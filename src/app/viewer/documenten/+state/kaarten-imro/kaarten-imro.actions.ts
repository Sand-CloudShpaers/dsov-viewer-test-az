import { createAction, props } from '@ngrx/store';
import { ImroKaartStyleConfig, ImroPlanResponse } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.model';
import { SymboolLocatie } from '~store/common/selection/selection.model';

export const loadStyleConfigs = createAction('[IMRO Kaarten] Load Style configs', props<{ documentIds: string[] }>());

export const loadingStyleConfigs = createAction(
  '[IMRO Kaarten] Loading Style configs',
  props<{ documentId: string }>()
);

export const loadStyleConfigsSuccess = createAction(
  '[IMRO Kaarten] Load Style configs Success',
  props<{ configs: ImroPlanResponse[] }>()
);

export const applyStyleConfig = createAction(
  '[IMRO Kaarten] Apply Style config',
  props<{ documentId: string; config: ImroKaartStyleConfig }>()
);

export const loadStyleConfigsFailure = createAction(
  '[IMRO Kaarten] Load Style configs Failure',
  props<{ documentIds: string[]; error?: Error }>()
);

export const loadStylesSuccess = createAction(
  '[IMRO Kaarten] Load Styles Success',
  props<{ configs: ImroPlanResponse[] }>()
);

export const loadStylesFailure = createAction(
  '[IMRO Kaarten] Load Styles Failures',
  props<{ documentIds: string[]; error?: Error }>()
);

export const getStyles = createAction(
  '[IMRO Kaarten] get DefaultStyles',
  props<{ planId: string; symboolLocaties: SymboolLocatie[] }>()
);

export const getDefaultStylesFailure = createAction(
  '[IMRO Kaarten] Reset Style Failure',
  props<{ planId: string; error: Error }>()
);
