import { Params } from '@angular/router';
import { createAction, props } from '@ngrx/store';
import { FilterName, FilterOptions, LocatieFilter, NamedFilter } from '../types/filter-options';
import { PDOKLookupDoc } from '~model/georegister';

export const LocatieLookup = createAction(
  '[filter] locatieFilter lookup locatie',
  props<{ locatie: LocatieFilter; commands: string[] }>()
);

export const LocatieSuggest = createAction(
  '[filter] locatieFilter suggest locatie',
  props<{ locatie: LocatieFilter; commands: string[] }>()
);

export const LocatieLoadExactGeometry = createAction(
  '[filter] locatieFilter load exact geometry',
  props<{ locatie: LocatieFilter; pdokLookup: PDOKLookupDoc; commands: string[] }>()
);

export const SearchWithCoordinates = createAction(
  '[filter] locatieFilter search location, with coordinates',
  props<{ locatie: LocatieFilter; commands: string[] }>()
);

export const LoadLocatieFilterError = createAction('[Filter] Load locatieFilter failure', props<{ error: Error }>());

export const SetTimeTravelDate = createAction('[filter] Set TimeTravelDate', props<{ timeTravelDate: string }>());

export const UpdateFilters = createAction(
  '[filter] Update Filters',
  props<{ filterOptions: FilterOptions; commands?: string[] }>()
);

export const UpdateFiltersSuccess = createAction(
  '[filter] Update Filters Success',
  props<{ filterOptions?: FilterOptions; commands: string[] }>()
);

export const PreviewFilters = createAction('[filter] Preview Filters', props<{ filterOptions: FilterOptions }>());

export const GetFiltersFromQueryParams = createAction(
  '[filter] Get Filters From Query Params',
  props<{ queryParams: Params }>()
);
export const ResetFilters = createAction(
  '[filter] Reset Filters',
  props<{ filterNames: FilterName[]; commands?: string[] }>()
);

export const ResetAllFilters = createAction('[filter] Reset All Filters', props<{ commands?: string[] }>());

export const RemoveFilter = createAction(
  '[filter] Remove Filter',
  props<{ namedFilter: NamedFilter; commands?: string[] }>()
);

export const ShowFilterPanel = createAction('[filter] Show Filter Panel');

export const HideFilterPanel = createAction('[filter] Hide Filter Panel');
