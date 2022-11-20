import { createAction, props } from '@ngrx/store';
import { ApiSource } from '~model/internal/api-source';
import { Tekst } from '~ihr-model/tekst';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import { Regeltekst } from '~ozon-model/regeltekst';
import { OntwerpDivisieannotatie } from '~ozon-model/ontwerpDivisieannotatie';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { LoadMoreLinks } from '~viewer/regels-op-maat/types/load-more-links';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

export const loadRegelsOpMaatPerDocument = createAction(
  '[Regels op maat] Load Per Document',
  props<{ document: DocumentDto }>()
);

export const loadRegelsOpMaatPerDocumentSuccess = createAction(
  '[Regels op maat] Load Per Document Success',
  props<{
    document: DocumentDto;
    apiSource: ApiSource;
    regelteksten: Regeltekst[];
    ontwerpRegelteksten: OntwerpRegeltekst[];
    divisieannotaties: Divisieannotatie[];
    ontwerpDivisieannotaties: OntwerpDivisieannotatie[];
    teksten: Tekst[];
    loadMoreLinks?: LoadMoreLinks;
  }>()
);
export const loadRegelsOpMaatPerDocumentFailure = createAction(
  '[Regels op maat] Load Per Document Failure',
  props<{ document: DocumentDto; error?: Error }>()
);

export const loadMoreRegelsOpMaatPerDocument = createAction(
  '[Regels op maat] Load More Per Document',
  props<{ document: DocumentDto }>()
);
export const loadMoreRegelsOpMaatPerDocumentSuccess = createAction(
  '[Regels op maat] Load More Per Document Success',
  props<{
    document: DocumentDto;
    apiSource: ApiSource;
    regelteksten: Regeltekst[];
    ontwerpRegelteksten: OntwerpRegeltekst[];
    divisieannotaties: Divisieannotatie[];
    ontwerpDivisieannotaties: OntwerpDivisieannotatie[];
    teksten: Tekst[];
    loadMoreLinks?: LoadMoreLinks;
  }>()
);

export const loadMoreRegelsOpMaatPerDocumentFailure = createAction(
  '[Regels op maat] Load More Per Document Failure',
  props<{ document: DocumentDto; error?: Error }>()
);
