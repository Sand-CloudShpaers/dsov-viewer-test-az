import { AnnotationId } from '~viewer/documenten/types/annotation';

export const getAnnotationEntityId = (annotationId: AnnotationId): string =>
  annotationId.technischId || annotationId.identificatie;
