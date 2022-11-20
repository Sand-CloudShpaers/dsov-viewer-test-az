import { createAction, props } from '@ngrx/store';
import { OmgevingsnormenEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Omgevingsnormen laden',
  props<{ annotationId: AnnotationId; href: string; ontwerpHref: string }>()
);
export const loadError = createAction(
  '[Annotaties] Omgevingsnormen laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction('[Annotaties] Omgevingsnormen laden succesvol', props<OmgevingsnormenEntity>());
