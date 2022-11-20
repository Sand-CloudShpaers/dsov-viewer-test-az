import { createRoutingFactory, Spectator } from '@ngneat/spectator';
import { SelectableListItemComponent } from './selectable-list-item.component';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { ApiSource } from '~model/internal/api-source';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PipesModule } from '~general/pipes/pipes.module';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('SelectableListItemComponent', () => {
  let spectator: Spectator<SelectableListItemComponent>;

  const createComponent = createRoutingFactory({
    component: SelectableListItemComponent,
    imports: [PipesModule],
    providers: [provideMockStore({ initialState })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        item: {
          apiSource: ApiSource.OZON,
          id: '123',
          name: 'naam',
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
          kwalificatie: 'kwalificatie',
          isSelected: false,
          isOntwerp: false,
        },
        showCheckbox: true,
        showSlider: false,
        active: true,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should emit selectionChange after slider is toggled', () => {
    spyOn(spectator.component.selectionChange, 'emit');
    spectator.component.onToggleSlider(spectator.component.item, false);

    expect(spectator.component.selectionChange.emit).toHaveBeenCalledWith({
      item: spectator.component.item,
      checked: false,
    });
  });

  it('should emit selectionChange after checkBox check', () => {
    spyOn(spectator.component.selectionChange, 'emit');
    spectator.component.onToggleCheckbox(spectator.component.item, { target: { checked: true } } as unknown as Event);

    expect(spectator.component.selectionChange.emit).toHaveBeenCalledWith({
      item: spectator.component.item,
      checked: true,
    });
  });

  it('should activate highlight', () => {
    spyOn(spectator.component.toggleHighlight, 'emit');
    spectator.component.addHighlight();

    expect(spectator.component.toggleHighlight.emit).toHaveBeenCalledWith(true);
  });

  it('should remove highlight', () => {
    spyOn(spectator.component.toggleHighlight, 'emit');
    spectator.component.removeHighlight();

    expect(spectator.component.toggleHighlight.emit).toHaveBeenCalledWith(false);
  });
});
