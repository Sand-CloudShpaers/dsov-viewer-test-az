import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { selectionMock } from '~store/common/selection/+state/selection-mock';
import { LegendGroupComponent } from './legend-group.component';

describe('LegendGroupComponent', () => {
  let spectator: Spectator<LegendGroupComponent>;

  const createComponent = createComponentFactory({
    component: LegendGroupComponent,
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        group: {
          id: 'groupId',
          name: 'groupName',
          selections: [selectionMock, selectionMock],
        },
      },
    });
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render group', () => {
    expect(spectator.query('[data-test-id="legend-group-name"]')).toExist();
    expect(spectator.queryAll('[data-test-id="legend-item--selection"')).toHaveLength(2);
  });
});
