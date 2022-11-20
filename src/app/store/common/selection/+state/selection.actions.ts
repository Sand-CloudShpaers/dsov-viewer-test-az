import { createAction, props } from '@ngrx/store';
import { Verbeelding } from '~ozon-model-verbeelden/verbeelding';
import { AnnotationId } from '~viewer/documenten/types/annotation';
import { Selection } from '../selection.model';

export const addSelections = createAction('[Selection] Add Selections', props<{ selections: Selection[] }>());

export const setSelectionsFromFilters = createAction('[Selection] Set Selections from filters');

export const updateSelections = createAction('[Selection] Update Selections', props<{ selections: Selection[] }>());

export const updateSelectionsFailure = createAction(
  '[Selection] Update Selections Failure',
  props<{ ids: string[]; error: Error }>()
);

export const loadVerbeeldingSuccess = createAction(
  '[Selection] Load Verbeelding Success',
  props<{ verbeelding: Verbeelding }>()
);

export const removeSelections = createAction('[Selection] Remove Selections', props<{ selections: Selection[] }>());

export const removeSelectionsForAnnotation = createAction(
  '[Selection] Remove Selections For Annotation',
  props<AnnotationId>()
);

export const resetSelections = createAction('[Selection] Reset Selections', props<{ excludeDocuments: boolean }>());

export const showSelectionsOnMap = createAction('[Selection] Show on Map');
