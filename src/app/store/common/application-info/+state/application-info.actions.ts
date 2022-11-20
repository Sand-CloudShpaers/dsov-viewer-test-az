import { createAction, props } from '@ngrx/store';
import { Info as OzonInfo } from '~ozon-model/info';
import { Info as IhrInfo } from '~ihr-model/info';

export const load = createAction('[Versions] Load');
export const loading = createAction('[Versions] Loading');
export const loadSuccess = createAction(
  '[Versions] Load Success',
  props<{ ozonPresenteren: OzonInfo; ozonVerbeelden: OzonInfo; ihr: IhrInfo }>()
);
export const loadFailure = createAction('[Versions] Load Failure', props<{ error?: Error }>());
