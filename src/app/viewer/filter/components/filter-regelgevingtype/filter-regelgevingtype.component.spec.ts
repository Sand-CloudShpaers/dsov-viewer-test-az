import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterRegelgevingtypeComponent } from './filter-regelgevingtype.component';
import { ApiSource } from '~model/internal/api-source';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';

describe('FilterRegelgevingtypeComponent', () => {
  let spectator: Spectator<FilterRegelgevingtypeComponent>;
  const filterId: RegelgevingtypeFilter = { id: 'id', name: 'name', applicableToSources: ['meh' as ApiSource] };

  const createComponent = createComponentFactory({
    component: FilterRegelgevingtypeComponent,
    providers: [mockProvider(FilterFacade), mockProvider(GegevenscatalogusProvider)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('isSelected', () => {
    expect(spectator.component.isSelected(filterId)).toBeFalse();

    spectator.component.currentFilterValues = [filterId];

    expect(spectator.component.isSelected(filterId)).toBeTrue();
  });
});
