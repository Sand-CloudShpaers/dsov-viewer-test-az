import { createAction, props } from '@ngrx/store';
import { LocatiesEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Locaties Laden',
  props<{ annotationId: AnnotationId; href: string; ontwerpHref: string }>()
);
export const loadError = createAction(
  '[Annotaties] Locaties Laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction('[Annotaties] Locaties Laden Success', props<LocatiesEntity>());
