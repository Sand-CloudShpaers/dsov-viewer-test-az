import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterIdentification, FilterName } from '~viewer/filter/types/filter-options';
import { FilterRegelsEnBeleidComponent } from './filter-regels-en-beleid.component';
import { ContentService } from '~services/content.service';

describe('FilterRegelsEnBeleidComponent', () => {
  let spectator: Spectator<FilterRegelsEnBeleidComponent>;
  const filterId: FilterIdentification = { id: 'id', name: 'name' };

  const createComponent = createComponentFactory({
    component: FilterRegelsEnBeleidComponent,
    providers: [mockProvider(FilterFacade), mockProvider(ContentService)],
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

  it('onChange, with checked', () => {
    spyOn(spectator.component.filterSelected, 'emit');
    spectator.component.filterName = FilterName.REGELSBELEID;
    spectator.component.onChange(filterId, { detail: { target: { checked: true } } } as unknown as Event);

    expect(spectator.component.filterSelected.emit).toHaveBeenCalledWith({ [FilterName.REGELSBELEID]: [filterId] });
  });

  it('onChange, with unchecked', () => {
    spyOn(spectator.component.filterSelected, 'emit');
    spectator.component.filterName = FilterName.REGELSBELEID;
    spectator.component.currentFilterValues = [filterId];
    spectator.component.onChange(filterId, { detail: { target: { checked: false } } } as unknown as Event);

    expect(spectator.component.filterSelected.emit).toHaveBeenCalledWith({ [FilterName.REGELSBELEID]: [] });
  });
});
