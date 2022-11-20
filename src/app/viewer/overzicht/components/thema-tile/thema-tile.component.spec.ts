import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Thema } from '~model/gegevenscatalogus/thema';
import { ThemaTileComponent } from './thema-tile.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const mockThema: Thema = {
  name: 'Bodem',
  id: 'http://standaarden.omgevingswet.overheid.nl/bodem/id/concept/Bodem',
  icon: 'soil',
  default: true,
};

describe('ThemaTileComponent', () => {
  let spectator: Spectator<ThemaTileComponent>;

  const createComponent = createComponentFactory({
    component: ThemaTileComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      name: mockThema.name,
      icon: mockThema.icon,
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should emit handleClick when clicked', () => {
    spyOn(spectator.component.handleClick, 'emit');
    spectator.component.onClick();

    expect(spectator.component.handleClick.emit).toHaveBeenCalled();
  });
});
