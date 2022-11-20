import { createAction, props } from '@ngrx/store';
import { AnnotationVM } from '../types/annotation';

export const collapseElementOpen = createAction(
  '[Documenten / Layout] Expand DocumentBodyElement',
  props<{ documentId: string; elementId: string }>()
);
export const collapseElementClose = createAction(
  '[Documenten / Layout] Collapse DocumentBodyElement',
  props<{ documentId: string; elementId: string }>()
);

export const toggleElementAnnotation = createAction(
  '[Documenten / Layout] Toggle DocumentBodyElement Annotations',
  props<{ documentId: string; elementId: string }>()
);

export const reset = createAction('[Documenten / Layout] Reset Layouts');

export const loadAnnotaties = createAction(
  '[Annotaties] Annotaties laden',
  props<{ annotation: AnnotationVM; documentId?: string }>()
);
