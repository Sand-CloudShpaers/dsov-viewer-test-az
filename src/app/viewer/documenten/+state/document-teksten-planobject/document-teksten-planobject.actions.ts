import { createAction, props } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import { TekstCollectie } from '~ihr-model/tekstCollectie';

export interface DocumentTekstenPlanobject {
  documentId?: string;
  planobjectId?: string;
  ihrObjectInfoLabel: string;
  ihrObjectInfoType: string;
  tekstCollectie?: TekstCollectie;
}
export const storeDocumentPlanobjectId = createAction(
  '[DocumentTeksten] Store DocumentPlanobjectLink',
  props<DocumentTekstenPlanobject>()
);

export const loadIhrDocumentTeksten = createAction(
  '[DocumentTeksten] Load Ihr DocumentTeksten',
  props<DocumentTekstenPlanobject>()
);

export const loadDocumentTekstenSuccess = createAction(
  '[DocumentTeksten] Load DocumentTeksten Success',
  props<DocumentTekstenPlanobject>()
);

export const loadDocumentTekstenFailure = createAction(
  '[DocumentTeksten] Load DocumentTeksten Failure',
  props<{ documentId: string; planobjectId: string; error?: Error }>()
);

export const showDocumentTekstenResult = createAction(
  '[DocumentTeksten] Show DocumentTeksten Result',
  props<{ content: string; title: string; subtitle: string; loadingStatus: LoadingState }>()
);
