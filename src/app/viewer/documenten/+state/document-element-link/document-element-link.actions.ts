import { createAction, props } from '@ngrx/store';
import { LoadingState } from '~model/loading-state.enum';
import { Tekst } from '~ihr-model/tekst';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { ImopNodeType } from '~viewer/documenten/types/imop-nodetypes';

export const storeDocumentElementLink = createAction(
  '[DocumentElementLink] Store DocumentElementLink',
  props<{ documentId: string; elementId: string; nodeType?: ImopNodeType }>()
);

export const loadOzonLinkTekst = createAction(
  '[DocumentElementLink] Load Ozon Linktekst',
  props<{ documentId: string; elementId: string; nodeType?: ImopNodeType }>()
);

export const loadOzonExternalLinkTekst = createAction(
  '[DocumentElementLink] Load Ozon ExternalLink',
  props<{ documentId: string; elementId: string }>()
);

export const loadIhrDocumentElement = createAction(
  '[DocumentElementLink] Load Ihr DocumentElement',
  props<{ documentId: string; elementId: string }>()
);

export const loadIhrDocumentElementSucces = createAction(
  '[DocumentElementLink] Load Ihr DocumentElement Success',
  props<{ tekst: Tekst; documentId: string; elementId: string }>()
);

export const loadDocumentElementFailure = createAction(
  '[DocumentElementLink] Load DocumentElement Failure',
  props<{ documentId: string; elementId: string; error?: Error }>()
);

export const showDocumentElementLinkResult = createAction(
  '[DocumentElementLink] Show DocumentElementLink Result',
  props<{
    documentId: string;
    content?: string; // From IHR
    element?: DocumentBodyElement; // From OZON
    title: string;
    subtitle: string;
    loadingStatus: LoadingState;
  }>()
);
