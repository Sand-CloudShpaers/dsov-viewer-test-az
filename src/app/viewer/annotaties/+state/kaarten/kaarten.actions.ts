import { createAction, props } from '@ngrx/store';
import { KaartenEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Kaarten Laden',
  props<{ annotationId: AnnotationId; href?: string; ontwerpHref?: string }>()
);
export const loadError = createAction(
  '[Annotaties] Kaarten Laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);

export const loadSuccess = createAction('[Annotaties] Kaarten Laden Success', props<KaartenEntity>());
