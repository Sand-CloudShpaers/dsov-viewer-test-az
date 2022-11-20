import { SelectableChangeEvent } from '@dso-toolkit/core/dist/types/components/selectable/selectable';
import { FilterIdentification, FilterName, FilterOptions } from '../types/filter-options';

export const timeTravelFilterKeys = ['beschikbaarOp', 'inWerkingOp', 'geldigOp'];

export const getCurrentFilterValuesOnChange = (
  item: FilterIdentification,
  currentFilterValues: FilterIdentification[],
  event: Event = null
): FilterIdentification[] => {
  const target = (event as CustomEvent<SelectableChangeEvent>)?.detail?.target as HTMLInputElement;
  if (target.checked) {
    currentFilterValues.push(item);
  } else {
    currentFilterValues = currentFilterValues.filter(i => !equals(item, i));
  }

  return currentFilterValues;
};

export const equals = (f1: FilterIdentification, f2: FilterIdentification): boolean => f1?.id === f2?.id;

/* Locatiefilter is compleet als WEL locatiefilter en WEL geometry */
export const isLocationFilterComplete = (filterOptions: FilterOptions): boolean =>
  !!filterOptions[FilterName.LOCATIE]?.length && !!filterOptions[FilterName.LOCATIE][0].geometry;

export const getDatum = (date: string): FilterIdentification[] => [
  {
    id: 'timetravel',
    name: 'tijdreizen',
    timeTravelDate: date,
    label: { hide: true },
  },
];

export const isTimeTravelLayer = (queryParams: { [key: string]: string }): boolean =>
  timeTravelFilterKeys.filter(key => queryParams[key]).length === timeTravelFilterKeys.length;
