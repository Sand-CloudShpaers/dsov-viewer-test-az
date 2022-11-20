import { createAction, props } from '@ngrx/store';
import { AnnotationId } from '~viewer/documenten/types/annotation';
import { Feature, FeaturesGroup } from './bestemmingsplan-features.reducer';

export const loading = createAction(
  '[Annotaties] BestemmingsplanFeatures Laden',
  props<{ annotationId: AnnotationId; documentId: string; featureGroups: FeaturesGroup[] }>()
);

export const loadError = createAction(
  '[Annotaties] BestemmingsplanFeatures Laden Error',
  props<{ annotationId: AnnotationId; error: Error }>()
);

export const loadSuccess = createAction(
  '[Annotaties] BestemmingsplanFeatures Laden Success',
  props<{ annotationId: AnnotationId; features: Feature[] }>()
);
