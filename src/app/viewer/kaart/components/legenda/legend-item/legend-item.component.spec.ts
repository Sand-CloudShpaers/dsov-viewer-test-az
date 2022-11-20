import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LegendItemComponent } from './legend-item.component';

describe('LegendItemComponent', () => {
  let spectator: Spectator<LegendItemComponent>;

  const createComponent = createComponentFactory({
    component: LegendItemComponent,
    providers: [mockProvider(FilterFacade), mockProvider(SelectionFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        naam: 'naam',
        symboolcode: 'code',
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render name and stymbool', () => {
    expect(spectator.query('[data-test-id="legend-item-name"]').textContent).toEqual('naam');
    expect(spectator.query('dsov-symbool')).toExist();
  });
});
