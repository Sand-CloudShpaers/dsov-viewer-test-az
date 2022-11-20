import { createAction, props } from '@ngrx/store';
import { Regeling } from '~ozon-model/regeling';
import { Plan } from '~ihr-model/plan';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { TimeTravelDates } from '~model/time-travel-dates';

export const loadDocument = createAction(
  '[Documenten] Load Document',
  props<{ document: DocumentDto; setAsSelected: boolean; timeTravelDates?: TimeTravelDates }>()
);
export const loadDocumentSuccess = createAction(
  '[Documenten] Load Document Success',
  props<{ ozon?: Regeling | OntwerpRegeling | Omgevingsvergunning; ihr?: Plan; id: string; setAsSelected: boolean }>()
);
export const loadDocumentFailure = createAction(
  '[Documenten] Load Document Failure',
  props<{ id: string; error?: Error }>()
);

export const setSelectedDocument = createAction(
  '[Documenten Page] Set Selected Document',
  props<{
    document: DocumentDto;
  }>()
);
export const resetSelectedDocument = createAction('[Documenten Page] Reset Selected Document');

export const setSelectedElement = createAction(
  '[Documenten Page] Set Selected Element',
  props<{
    id: string;
  }>()
);
export const resetSelectedElement = createAction('[Documenten Page] Reset Selected Element');

export const resetDocumenten = createAction('[Documenten] Documenten Reset');
