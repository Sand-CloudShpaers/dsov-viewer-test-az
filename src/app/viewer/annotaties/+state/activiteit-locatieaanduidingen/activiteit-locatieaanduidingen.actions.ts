import { createAction, props } from '@ngrx/store';
import { ActiviteitLocatieaanduidingenEntity } from '~viewer/annotaties/types/entity';
import { AnnotationId } from '~viewer/documenten/types/annotation';

export const loading = createAction(
  '[Annotaties] Activiteit Locatieaanduidingen laden',
  props<{ annotationId: AnnotationId }>()
);
export const loadError = createAction(
  '[Annotaties] Activiteit Locatieaanduidingen laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);
export const loadSuccess = createAction(
  '[Annotaties] Activiteit Locatieaanduidingen laden succesvol',
  props<ActiviteitLocatieaanduidingenEntity>()
);
