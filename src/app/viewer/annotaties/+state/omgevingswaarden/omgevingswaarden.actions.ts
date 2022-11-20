import { createAction, props } from '@ngrx/store';
import { OmgevingswaardenEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Omgevingswaarde laden',
  props<{ annotationId: AnnotationId; href: string; ontwerpHref: string }>()
);
export const loadError = createAction(
  '[Annotaties] Omgevingswaarde laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction(
  '[Annotaties] Omgevingswaarde laden succesvol',
  props<OmgevingswaardenEntity>()
);
