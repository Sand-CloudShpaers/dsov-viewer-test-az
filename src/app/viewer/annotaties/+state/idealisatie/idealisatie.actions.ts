import { createAction, props } from '@ngrx/store';
import { Locaties } from '~ozon-model/locaties';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Idealisatie Laden',
  props<{ annotationId: AnnotationId; href: string }>()
);
export const loadError = createAction(
  '[Annotaties] Idealisatie Laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction(
  '[Annotaties] Idealisatie Laden Success',
  props<{ annotationId: AnnotationId; locaties: Locaties }>()
);
