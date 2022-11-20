import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { PipesModule } from '~general/pipes/pipes.module';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SearchActiviteitComponent } from './search-activiteit.component';
import { mockActiviteitenGroepVM } from '~viewer/overzicht/activiteiten/+state/activiteiten.mock';
import { ActiviteitSuggestion } from '~viewer/overzicht/types/activiteit-suggestion';

describe('SearchActiviteitComponent', () => {
  let spectator: Spectator<SearchActiviteitComponent>;
  const spyOnOpenActiviteitFilter = jasmine.createSpy('spyOnOpenActiviteitFilter');

  const createComponent = createComponentFactory({
    component: SearchActiviteitComponent,
    imports: [RouterTestingModule, PipesModule],
    providers: [mockProvider(FilterFacade, { openActiviteitFilter: spyOnOpenActiviteitFilter })],
    declarations: [MockComponent(SearchActiviteitComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should return suggestions', () => {
    spectator.component.activiteitenGroepen = [mockActiviteitenGroepVM];
    spectator.component.search({ detail: 'dagje' } as CustomEvent);

    expect(spectator.component.suggestions).toEqual([
      {
        value: mockActiviteitenGroepVM.activiteiten[0].naam,
        filterIdentification: {
          id: mockActiviteitenGroepVM.activiteiten[0].identificatie,
          name: mockActiviteitenGroepVM.activiteiten[0].naam,
          group: mockActiviteitenGroepVM.waarde,
        },
      },
      {
        value: mockActiviteitenGroepVM.activiteiten[1].naam,
        filterIdentification: {
          id: mockActiviteitenGroepVM.activiteiten[1].identificatie,
          name: mockActiviteitenGroepVM.activiteiten[1].naam,
          group: mockActiviteitenGroepVM.waarde,
        },
      },
    ]);
  });

  it('should openActivititeitFilter', () => {
    const suggestion: ActiviteitSuggestion = {
      value: mockActiviteitenGroepVM.activiteiten[1].naam,
      filterIdentification: {
        id: mockActiviteitenGroepVM.activiteiten[1].identificatie,
        name: mockActiviteitenGroepVM.activiteiten[1].naam,
        group: mockActiviteitenGroepVM.waarde,
      },
    };
    spectator.component.select({ detail: suggestion } as CustomEvent);

    expect(spyOnOpenActiviteitFilter).toHaveBeenCalledWith([
      { naam: suggestion.filterIdentification.name, identificatie: suggestion.filterIdentification.id },
    ]);
  });

  describe('No result', () => {
    it('should return message, when no matches', () => {
      spectator.component.activiteitenGroepen = [mockActiviteitenGroepVM];
      spectator.component.search({ detail: 'dagje uit' } as CustomEvent);

      expect(spectator.component.suggestions).toEqual([
        {
          filterIdentification: null,
          value: 'Geen activiteiten gevonden',
        },
      ]);
    });

    it('should return no suggestions, when no search term', () => {
      spectator.component.activiteitenGroepen = [mockActiviteitenGroepVM];
      spectator.component.search({ detail: '' } as CustomEvent);

      expect(spectator.component.suggestions).toEqual([]);
    });
  });
});
