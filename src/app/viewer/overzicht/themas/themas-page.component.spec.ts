import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { ThemasPageComponent } from './themas-page.component';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { Thema } from '~model/gegevenscatalogus/thema';

describe('ThemasPageComponent', () => {
  let spectator: Spectator<ThemasPageComponent>;

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

  const createComponent = createComponentFactory({
    imports: [RouterTestingModule],
    component: ThemasPageComponent,
    providers: [
      mockProvider(GegevenscatalogusProvider),
      mockProvider(NavigationService),
      mockProvider(FilterFacade, { openThemaFilter: spyOnOpenThemaFilter }),
      provideMockStore({
        initialState,
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should openThemaFilter', () => {
    spectator.component.onSelectThema(mockThemas[0]);

    expect(spyOnOpenThemaFilter).toHaveBeenCalledWith(mockThemas[0]);
  });
});
