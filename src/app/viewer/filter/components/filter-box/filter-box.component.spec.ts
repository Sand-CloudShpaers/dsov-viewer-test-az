import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { initialFilterOptions } from '~viewer/filter/+state/filter.reducer';
import { FilterIdentification } from '~viewer/filter/types/filter-options';
import { FilterBoxComponent } from './filter-box.component';
import { ContentService } from '~services/content.service';

describe('FilterBoxComponent', () => {
  let spectator: Spectator<FilterBoxComponent>;

  const filterId: FilterIdentification = {
    id: 'id',
    name: 'name',
  };

  const createComponent = createComponentFactory({
    component: FilterBoxComponent,
    providers: [mockProvider(ContentService)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.title = 'Thema';
    spectator.component.description = 'Beschrijving';
    spectator.component.filterOptions = {
      ...initialFilterOptions,
      thema: [filterId],
    };
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should return true, when there are related filters', () => {
    expect(spectator.component.isActive()).toEqual('');
  });

  it('should leave', () => {
    spyOn(spectator.component.leave, 'emit');
    spectator.component.edit();

    expect(spectator.component.leave.emit).toHaveBeenCalled();
  });
});
