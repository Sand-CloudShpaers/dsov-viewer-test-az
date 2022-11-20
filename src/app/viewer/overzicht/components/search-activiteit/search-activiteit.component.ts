import { Component, Input, OnInit } from '@angular/core';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ActiviteitenGroepVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { ActiviteitSuggestion } from '~viewer/overzicht/types/activiteit-suggestion';

@Component({
  selector: 'dsov-search-activiteit',
  templateUrl: './search-activiteit.component.html',
})
export class SearchActiviteitComponent implements OnInit {
  @Input() public activiteitenGroepen: ActiviteitenGroepVM[];
  public suggestions: ActiviteitSuggestion[] = [];
  public noResults: boolean;
  private searchBar: HTMLInputElement;

  constructor(private filterFacade: FilterFacade) {}

  public ngOnInit(): void {
    this.searchBar = document.getElementById('search-bar--with-value') as HTMLInputElement;
  }

  public search(event: Event): void {
    const value = (event as CustomEvent).detail;
    if (value.length) {
      this.suggestions = this.getSuggestions(this.activiteitenGroepen, value);

      if (!this.suggestions.length) {
        this.suggestions = [
          {
            filterIdentification: null,
            value: 'Geen activiteiten gevonden',
          },
        ];
      }
    } else {
      this.suggestions = [];
    }
  }

  public select(event: Event): void {
    const suggestion: ActiviteitSuggestion = (event as CustomEvent).detail;
    if (suggestion.filterIdentification) {
      this.filterFacade.openActiviteitFilter([
        { naam: suggestion.filterIdentification.name, identificatie: suggestion.filterIdentification.id },
      ]);
    }
  }

  private getSuggestions(activiteitenGroepen: ActiviteitenGroepVM[], inputValue: string): ActiviteitSuggestion[] {
    return activiteitenGroepen.reduce(
      (groepen, activiteitenGroep) => groepen.concat(this.createSearchSuggestions(activiteitenGroep, inputValue)),
      [] as ActiviteitSuggestion[]
    );
  }

  private createSearchSuggestions(activiteitenGroep: ActiviteitenGroepVM, inputValue: string): ActiviteitSuggestion[] {
    return activiteitenGroep.activiteiten
      .filter(activiteit => activiteit.naam.toLowerCase().includes(inputValue.toLowerCase()))
      .map(activiteit => ({
        value: activiteit.naam,
        filterIdentification: {
          id: activiteit.identificatie,
          name: activiteit.naam,
          group: activiteitenGroep.waarde,
        },
      }));
  }

  public clear(): void {
    this.searchBar.value = null;
  }
}
