import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFilter from './filter.reducer';
import { filterKey } from '~store/state';
import { FilterIdentification, FilterName, FilterOptions, LocatieFilter } from '../types/filter-options';
import { getKeys } from '~general/utils/object.utils';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { LocationType } from '~model/internal/active-location-type.model';

const filterFeatureSelector = createFeatureSelector<fromFilter.State>(filterKey);

export const getFilterOptions = createSelector(filterFeatureSelector, (state): FilterOptions => state.filterOptions);

export const getFilterOptionsForLocatie = createSelector(
  getFilterOptions,
  (filterOptions): FilterOptions => ({
    [FilterName.LOCATIE]: filterOptions[FilterName.LOCATIE],
  })
);

export const getLocatieFilter = createSelector(
  getFilterOptions,
  (filterOptions): LocatieFilter =>
    filterOptions[FilterName.LOCATIE] ? filterOptions[FilterName.LOCATIE][0] : undefined
);

export const getActiveZoekLocatieSystem = createSelector(
  getLocatieFilter,
  (locatieFilter): ZoekLocatieSystem => locatieFilter?.coordinaten?.system
);

export const getActiveLocationIsLargeArea = createSelector(getLocatieFilter, (locatieFilter): boolean =>
  [LocationType.Contour].includes(locatieFilter?.source)
);

export const getFilterOptionsForLabels = createSelector(
  getFilterOptions,
  (filterOptions): FilterOptions => ({
    ...filterOptions,
    /* Bij het tonen van labels hoeven geen documenten getoond te worden */
    [FilterName.DOCUMENTEN]: [],
    [FilterName.LOCATIE]: [],
  })
);

export const getNotAllFiltersApply = createSelector(getFilterOptions, filterOptions =>
  getKeys(filterOptions)
    .filter(key => [FilterName.THEMA].includes(key as FilterName))
    .some(key => filterOptions[key].length)
);

export const getTimeTravelFilter = createSelector(
  getFilterOptions,
  (filterOptions): FilterIdentification =>
    filterOptions[FilterName.DATUM] ? filterOptions[FilterName.DATUM][0] : undefined
);

export const getShowPanel = createSelector(filterFeatureSelector, (state): boolean => state.showPanel);
