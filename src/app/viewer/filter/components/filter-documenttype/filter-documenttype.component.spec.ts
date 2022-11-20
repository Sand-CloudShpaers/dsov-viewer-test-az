import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterIdentification, FilterName } from '~viewer/filter/types/filter-options';
import { FilterDocumenttypeComponent } from './filter-documenttype.component';

export const mockDocumenttypes: Documenttype[] = [
  {
    id: 'omgevingsverordening',
    name: 'omgevingsverordening',
    group: 'regels',
    ozonValue: '/join/id/stop/regelingtype_004',
  },
  {
    id: 'omgevingsvisie',
    name: 'omgevingsvisie',
    ozonValue: '/join/id/stop/regelingtype_006',
    group: 'beleid',
  },
  {
    id: 'omgevingsplan',
    name: 'Omgevingsplan (Omgevingswet)',
    ozonValue: '/join/id/stop/regelingtype_003',
    group: 'regels',
  },
];

describe('FilterDocumenttypeComponent', () => {
  let spectator: Spectator<FilterDocumenttypeComponent>;
  const filterId: FilterIdentification = { id: 'id', name: 'name' };

  const createComponent = createComponentFactory({
    component: FilterDocumenttypeComponent,
    providers: [mockProvider(FilterFacade), mockProvider(GegevenscatalogusProvider)],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should get form', () => {
    expect(spectator.component.getForm(mockDocumenttypes)).toEqual([
      {
        name: 'Regels',
        items: [mockDocumenttypes[0], mockDocumenttypes[2]],
      },
      {
        name: 'Beleid',
        items: [mockDocumenttypes[1]],
      },
    ]);
  });

  it('isSelected', () => {
    expect(spectator.component.isSelected(filterId)).toBeFalse();

    spectator.component.currentFilterValues = [filterId];

    expect(spectator.component.isSelected(filterId)).toBeTrue();
  });

  it('onChange, with checked', () => {
    spyOn(spectator.component.filterSelected, 'emit');
    spectator.component.filterName = FilterName.DOCUMENT_TYPE;
    spectator.component.onChange(filterId, { detail: { target: { checked: true } } } as unknown as Event);

    expect(spectator.component.filterSelected.emit).toHaveBeenCalledWith({ [FilterName.DOCUMENT_TYPE]: [filterId] });
  });

  it('onChange, with unchecked', () => {
    spyOn(spectator.component.filterSelected, 'emit');
    spectator.component.filterName = FilterName.DOCUMENT_TYPE;
    spectator.component.currentFilterValues = [filterId];
    spectator.component.onChange(filterId, { detail: { target: { checked: false } } } as unknown as Event);

    expect(spectator.component.filterSelected.emit).toHaveBeenCalledWith({ [FilterName.DOCUMENT_TYPE]: [] });
  });
});
