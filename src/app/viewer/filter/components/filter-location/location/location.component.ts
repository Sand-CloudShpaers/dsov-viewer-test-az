import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationSuggestion } from '~viewer/filter/types/location-suggestion';
import { LocationType } from '~model/internal/active-location-type.model';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LocatieFilter } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-search-location',
  templateUrl: './location.component.html',
})
export class LocationComponent implements OnDestroy, OnInit {
  public suggestions$: Observable<LocationSuggestion[]> = this.filterFacade.locationSuggestions$;

  @Input() public locationFilter: LocatieFilter;
  @Output() public changeLocation: EventEmitter<LocatieFilter> = new EventEmitter<LocatieFilter>();
  @Input() public showRequiredError = false;

  private searchBar: HTMLInputElement;

  constructor(private filterFacade: FilterFacade) {}

  public ngOnInit(): void {
    this.searchBar = document.getElementById('search-locatie__input') as HTMLInputElement;
  }

  public ngOnDestroy(): void {
    this.filterFacade.resetLocationSuggestions();
  }

  public search(event: Event): void {
    const value = (event as CustomEvent).detail;
    if (value.length) {
      this.filterFacade.fetchLocationSuggestions(value);
    }
  }

  public select(event: Event): void {
    const suggestion: LocationSuggestion = (event as CustomEvent).detail;
    this.searchBar.value = suggestion.name;
    this.changeLocation.emit({
      id: suggestion.pdokId,
      source: suggestion.source,
      name: suggestion.name,
      pdokId: suggestion.pdokId,
      geometry: null,
    });
  }

  public getActiveLocationValue = (): string =>
    [LocationType.Adres, LocationType.Perceel].includes(this.locationFilter?.source) ? this.locationFilter.name : null;

  public clear(): void {
    this.searchBar.value = null;
  }
}
