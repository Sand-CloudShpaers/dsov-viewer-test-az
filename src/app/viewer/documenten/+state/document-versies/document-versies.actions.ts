import { createAction, props } from '@ngrx/store';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';

export const load = createAction('[Document Versies] Load', props<{ documentId: string; isOntwerp: boolean }>());
export const loadingVastgesteld = createAction(
  '[Document Versies] Loading Vastgesteld',
  props<{ documentId: string; isOntwerp: boolean }>()
);
export const loadingOntwerp = createAction(
  '[Document Versies] Loading Ontwerp',
  props<{ documentId: string; hrefs: string[] }>()
);
export const loadingVastgesteldSuccess = createAction(
  '[Document Versies] Loading Vastgesteld Success',
  props<{ documentId: string; regelingen: Regeling[] }>()
);
export const loadingOntwerpSuccess = createAction(
  '[Document Versies] Loading Ontwerp Success',
  props<{ documentId: string; regelingen: OntwerpRegeling[] }>()
);
export const loadingVastgesteldFailure = createAction(
  '[Document Versies] Loading Vastgesteld Failure',
  props<{ documentId: string; error?: Error }>()
);
export const loadingOntwerpFailure = createAction(
  '[Document Versies] Loading Ontwerp Failure',
  props<{ documentId: string; error?: Error }>()
);
export const openDocument = createAction(
  '[Document Versies] Open document',
  props<{ documentId: string; href: string }>()
);
export const reset = createAction('[Document Versies] Reset');
