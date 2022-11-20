import { ApiSource } from '~model/internal/api-source';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';

export const regelgevingtypeFilterMocks: RegelgevingtypeFilter[] = [
  {
    ozonValue: 'type',
    id: 'id',
    name: 'name',
    applicableToSources: [ApiSource.OZON],
  },
  {
    ozonValue: 'voorOzon',
    id: 'instructieregelInstrument',
    name: 'name2',
    applicableToSources: [ApiSource.OZON],
    items: [{ name: 'besluit geldelijke regelingen', id: 'http', selected: true }],
  },
];
