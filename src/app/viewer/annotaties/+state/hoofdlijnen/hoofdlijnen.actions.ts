import { createAction, props } from '@ngrx/store';
import { HoofdlijnenEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Hoofdlijnen Laden',
  props<{ annotationId: AnnotationId; href: string; ontwerpHref: string }>()
);
export const loadError = createAction(
  '[Annotaties] Hoofdlijnen Laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction('[Annotaties] Hoofdlijnen Laden Success', props<HoofdlijnenEntity>());
