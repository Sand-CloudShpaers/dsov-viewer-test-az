import { createAction, props } from '@ngrx/store';
import { ZoekParameters } from '~general/utils/filter.utils';
import { Regeltekst } from '~ozon-model/regeltekst';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';

export const openedRegeltekstForElement = createAction(
  '[Ozon Regeltekst] Opened Regeltekst for Element',
  props<{ documentId: string; documentstructuurelementId: string; regeltekstHref: string; isOntwerp: boolean }>()
);

export const loadRegeltekst = createAction(
  '[Ozon Regeltekst] Load Regeltekst',
  props<{ documentstructuurelementId: string; regeltekstHref: string; isOntwerp: boolean }>()
);
export const loadRegeltekstSuccess = createAction(
  '[Ozon Regeltekst] Load Regeltekst Success',
  props<{ documentstructuurelementId: string; vastgesteld?: Regeltekst; ontwerp?: OntwerpRegeltekst }>()
);
export const loadRegeltekstFailure = createAction(
  '[Ozon Regeltekst]] Load Regeltekst Failure',
  props<{ documentstructuurelementId: string; error?: Error }>()
);

export const loadRegelteksten = createAction(
  '[Ozon Regeltekst] Load Regelteksten',
  props<{ zoekParameters: ZoekParameters[]; id: string }>()
);
export const loadRegeltekstenSuccess = createAction(
  '[Ozon Regeltekst] Load Regelteksten Success',
  props<{ id: string; vastgesteld: Regeltekst[]; ontwerp: OntwerpRegeltekst[] }>()
);
export const loadRegeltekstenFailure = createAction(
  '[Ozon Regeltekst]] Load Document Regelteksten Failure',
  props<{ id: string; error?: Error }>()
);
