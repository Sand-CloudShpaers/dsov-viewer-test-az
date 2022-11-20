import { createAction, props } from '@ngrx/store';
import { TekstCollectie } from '~ihr-model/tekstCollectie';
import { Tekst } from '~ihr-model/tekst';
import { DocumentComponenten } from '~ozon-model/documentComponenten';
import { OntwerpDocumentComponenten } from '~ozon-model/ontwerpDocumentComponenten';
import { LoadingState } from '~model/loading-state.enum';
import { DocumentSubPage, DocumentSubPagePath } from '~viewer/documenten/types/document-pages';

export const resetDocumentStructuur = createAction('[DocumentStructuur Page] Document Structuur Reset');

export const loadOzonDocumentStructuur = createAction(
  '[OZON Documentstructuur] Load Document Structuur',
  props<{ id: string; href: string }>()
);

export const loadOzonDocumentStructuurSuccess = createAction(
  '[OZON Documentstructuur] Load Document Structuur Success',
  props<{ id: string; data?: DocumentComponenten | OntwerpDocumentComponenten }>()
);

export const loadIhrDocumentOnderdeel = createAction(
  '[IHR Documentonderdeel] Load Document Onderdeel',
  props<{ id: string; subPage: DocumentSubPage }>()
);

export const loadIhrDocumentOnderdeelSuccess = createAction(
  '[IHR Documentonderdeel] Load Document Onderdeel Success',
  props<{ id: string; data?: Tekst; documentSubPagePath: DocumentSubPagePath }>()
);

export const loadIhrDocumentOnderdeelFailure = createAction(
  '[IHR Documentonderdeel] Load Document Onderdeel Failure',
  props<{ id: string; error?: Error }>()
);

export const loadIhrDocumentStructuur = createAction(
  '[IHR Documentstructuur] Load Document Structuur',
  props<{ id: string; parentId: string }>()
);

export const loadIhrDocumentStructuurSuccess = createAction(
  '[IHR Documentstructuur] Load Document Structuur Success',
  props<{ id: string; parentId: string; data?: TekstCollectie; addition?: boolean }>()
);

export const loadDocumentStructuurForSelectedDocument = createAction(
  '[DocumentStructuur Page] Load Document Structuur for selected document',
  props<{ id: string; documentSubPagePaths?: DocumentSubPagePath[] }>()
);

export const loadDocumentStructuurFailure = createAction(
  '[Documentstructuur] Load Document structuur Failure',
  props<{ id: string; error?: Error }>()
);

export const setLoadingState = createAction(
  '[Documentstructuur] Set Loading State',
  props<{ id: string; loadingState: LoadingState }>()
);
