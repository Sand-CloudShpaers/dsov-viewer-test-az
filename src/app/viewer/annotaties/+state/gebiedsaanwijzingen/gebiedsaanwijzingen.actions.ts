import { createAction, props } from '@ngrx/store';
import { GebiedsaanwijzingenEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Gebiedsaanwijzingen laden',
  props<{ annotationId: AnnotationId; href: string; ontwerpHref: string }>()
);
export const loadError = createAction(
  '[Annotaties] Gebiedsaanwijzingen laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction(
  '[Annotaties] Gebiedsaanwijzingen laden succesvol',
  props<GebiedsaanwijzingenEntity>()
);
