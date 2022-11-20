import { createAction, props } from '@ngrx/store';
import { Regeling } from '~ozon-model/regeling';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

export const loadRegelsOpMaat = createAction('[Regels op maat] Load');

export const loadRegelsOpMaatWithDocuments = createAction(
  '[Regels op maat] Load Success',
  props<{ documents: DocumentDto[] }>()
);

export const loadRegelsOpMaatFailure = createAction('[Regels op maat] Load failure', props<{ error?: Error }>());

export const loadRegelsOpMaatDocumenten = createAction(
  '[Regels op maat] Load Documenten',
  props<{ regelsUrl: string; tekstdelenUrl: string; documents: DocumentDto[] }>()
);

export const loadDocumentsSuccess = createAction(
  '[Regels op maat] Load Documents Success',
  props<{ regelingen: Regeling[] }>()
);

export const resetRegelsOpMaat = createAction('[Regels op maat] Reset');
