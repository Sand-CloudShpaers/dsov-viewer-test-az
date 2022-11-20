import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { OverzichtThemaComponent } from './overzicht-thema.component';
import { Thema } from '~model/gegevenscatalogus/thema';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ContentService } from '~services/content.service';

const mockThemas: Thema[] = [
  {
    name: 'Bodem',
    id: 'http://standaarden.omgevingswet.overheid.nl/bodem/id/concept/Bodem',
    icon: 'soil',
    default: true,
  },
  {
    name: 'Bouwwerken',
    id: 'http://standaarden.omgevingswet.overheid.nl/bouwwerken/id/concept/Bouwwerken',
    icon: 'buildings',
    default: true,
  },
  {
    name: 'Cultureel erfgoed',
    id: '',
    icon: 'cultural',
  },
];
const spyOnOpenThemaFilter = jasmine.createSpy('spyOnOpenThemaFilter');

describe('OverzichtThemaComponent', () => {
  let spectator: Spectator<OverzichtThemaComponent>;

  const createComponent = createComponentFactory({
    component: OverzichtThemaComponent,
    providers: [
      provideMockStore({ initialState }),
      mockProvider(FilterFacade, { openThemaFilter: spyOnOpenThemaFilter }),
      mockProvider(ContentService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      themas: mockThemas,
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show themas', () => {
    expect(spectator.queryAll('dsov-thema-tile').length).toEqual(2);
  });

  it('should openThemaFilter', () => {
    spectator.component.onSelectThema(mockThemas[0]);

    expect(spyOnOpenThemaFilter).toHaveBeenCalledWith(mockThemas[0]);
  });
});
