import { createAction, props } from '@ngrx/store';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { DivisieannotatieEntity } from '../divisieannotatie/divisieannotatie.reducer';
import { RegeltekstEntity } from '../regeltekst/regeltekst.reducer';

export const loadFilter = createAction(
  '[Ozon Structuurelement Filter] Load Filter',
  props<{
    id: string;
    document: DocumentDto;
    beschrijving: string;
    filterType: FilterType;
    themaId?: string;
    hoofdlijnId?: string;
  }>()
);

export const loadFilterSuccess = createAction(
  '[Ozon Structuurelement Filter] Load Filter Success',
  props<{
    id: string;
    divisieannotaties: DivisieannotatieEntity[];
    regelteksten: RegeltekstEntity[];
  }>()
);

export const loadFilterFailure = createAction(
  '[Ozon Structuurelement Filter] Load Filter Failure',
  props<{ id: string; error?: Error }>()
);

export const removeFilter = createAction('[Ozon Structuurelement Filter] Remove Filter', props<{ id: string }>());

export const removeFilters = createAction('[Ozon Structuurelement Filter] Remove Filters');
