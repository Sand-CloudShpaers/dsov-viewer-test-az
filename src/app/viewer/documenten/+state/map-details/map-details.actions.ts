import { createAction, props } from '@ngrx/store';
import { FeatureLike } from 'ol/Feature';
import { CartografieSummaryCollectie } from '~ihr-model/cartografieSummaryCollectie';
import { Selection } from '~store/common/selection/selection.model';

export const load = createAction(
  '[Map Details] Load Cartografie',
  props<{ documentId: string; features: FeatureLike[] }>()
);

export const loadSuccess = createAction(
  '[Map Details] Load Cartografie Success',
  props<{ documentId: string; cartografie: CartografieSummaryCollectie }>()
);

export const loadFailure = createAction(
  '[Map Details] Load Cartografie Failure',
  props<{ documentId: string; error?: Error }>()
);

export const reset = createAction('[Map Details] Reset');

export const showMapDetails = createAction(
  '[Map Details] showMapDetails',
  props<{ documentId: string; selections: Selection[] }>()
);
