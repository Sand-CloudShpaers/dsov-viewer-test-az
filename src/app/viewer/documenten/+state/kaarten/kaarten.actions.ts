import { createAction, props } from '@ngrx/store';
import { ZoekParameters } from '~general/utils/filter.utils';
import { Href } from '~ozon-model/href';
import { Kaart } from '~ozon-model/kaart';

export const checkLoadKaarten = createAction('[Ozon Kaarten] Check Load', props<{ documentId: string }>());

export const loadKaarten = createAction(
  '[Ozon Kaarten] Load',
  props<{ zoekParameters: ZoekParameters[]; documentId: string; kaarten: Kaart[]; href?: Href }>()
);

export const loadKaartenSuccess = createAction(
  '[Ozon Kaarten] Load Success',
  props<{ documentId: string; kaarten: Kaart[] }>()
);

export const loadKaartenFailure = createAction(
  '[Ozon Kaarten] Load Failure',
  props<{ documentId: string; error: Error }>()
);
