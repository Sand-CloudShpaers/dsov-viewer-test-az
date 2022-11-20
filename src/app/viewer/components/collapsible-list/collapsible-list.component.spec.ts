import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { CollapsibleListComponent } from './collapsible-list.component';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { ApiSource } from '~model/internal/api-source';
import { CollapsibleListModule } from './collapsible-list.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { HighlightFacade } from '~store/common/highlight/+state/highlight.facade';

describe('CollapsibleListComponent', () => {
  let spectator: Spectator<CollapsibleListComponent>;
  const createComponent = createRoutingFactory({
    component: CollapsibleListComponent,
    imports: [CollapsibleListModule],
    providers: [provideMockStore({ initialState }), mockProvider(SelectionFacade), mockProvider(HighlightFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should create and expand a list', () => {
    spectator.setInput({
      naam: 'naam',
      lists: [
        {
          items: [
            {
              apiSource: ApiSource.OZON,
              id: '',
              name: 'naam',
              objectType: SelectionObjectType.GEBIEDSAANWIJZING,
              isSelected: false,
              isOntwerp: false,
              kwalificatie: 'kwalificatie',
            },
          ],
        },
      ],
    });
    spectator.detectChanges();
    spectator.click('[data-test-id="collapsible-list__button"]');
    const listItems = spectator.queryAll('dsov-selectable-list-item');

    expect(listItems).toHaveLength(1);
    expect(spectator.queryAll('[data-test-id="selectable-list__item-text__naam"]')[0]).toHaveText('naam');
    expect(spectator.queryAll('[data-test-id="selectable-list__item-text__kwalificatie"]')[0]).toHaveText(
      'kwalificatie'
    );
  });

  it('should create embedded list', () => {
    spectator.setInput({
      embedded: [
        {
          identificatie: 'enderest',
          isExpanded: false,
          lists: [],
          naam: 'overig',
        },
      ],
      lists: [],
    });
    spectator.detectChanges();
    spectator.click('[data-test-id="collapsible-list__button"]');

    expect(spectator.queryAll('dsov-collapsible-list')).toHaveLength(1);
  });
});
