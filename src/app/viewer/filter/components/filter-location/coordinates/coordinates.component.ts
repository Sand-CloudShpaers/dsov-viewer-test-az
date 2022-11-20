import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ZoekLocatieCoordinates, ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { LocationType } from '~model/internal/active-location-type.model';
import { LocatieFilter } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-search-coordinates',
  templateUrl: './coordinates.component.html',
  styleUrls: ['./coordinates.component.scss'],
})
export class CoordinatesComponent implements OnInit {
  @Input() public isLoading: boolean;
  @Input() public locationFilter: LocatieFilter;
  @Input() public autoSearch: boolean;
  @Input() public showRequiredError = false;
  @Input() public isTimeTravel = false;
  @Output() public changeCoordinates = new EventEmitter<LocatieFilter>();

  public searchValue: string;
  public showInvalidError = false;
  public isRd = true;

  constructor(private searchService: LocatieFilterService) {}

  public ngOnInit(): void {
    const coordinaten = this.locationFilter?.coordinaten;
    this.isRd = coordinaten ? coordinaten.system === ZoekLocatieSystem.RD : this.isRd;
    this.searchValue = coordinaten
      ? coordinaten.system === ZoekLocatieSystem.RD
        ? `${coordinaten[coordinaten.system]}`
        : `${coordinaten[coordinaten.system][1]}, ${coordinaten[coordinaten.system][0]}`
      : null;
  }

  public handleInput = (event: Event): void => {
    this.showInvalidError = false;
    const element = event.currentTarget as HTMLInputElement;

    this.searchValue = element.value;

    if (this.autoSearch) {
      this.search();
    }
  };

  public handleRadio = (status: boolean): void => {
    this.isRd = status;

    if (this.autoSearch) {
      this.search();
    }
  };

  public search(): void {
    this.showInvalidError = !this.isCorrectCoordinates();
    const parsedCoordinates = this.searchService.getParsedCoordinates(this.searchValue, this.isRd);
    if (parsedCoordinates) {
      const system = this.isRd ? ZoekLocatieSystem.RD : ZoekLocatieSystem.ETRS89;
      const coordinates: ZoekLocatieCoordinates = {
        system: this.isRd ? ZoekLocatieSystem.RD : ZoekLocatieSystem.ETRS89,
      };
      this.changeCoordinates.emit({
        id: this.searchValue,
        source: system === ZoekLocatieSystem.RD ? LocationType.CoordinatenRD : LocationType.CoordinatenETRS89,
        coordinaten: {
          ...coordinates,
          [system]: this.isRd ? parsedCoordinates : [parsedCoordinates[1], parsedCoordinates[0]],
        },
        name: this.searchValue,
        geometry: null,
      });
    } else if (this.isTimeTravel) {
      // Bij tijdreizen ook emitten als er geen coördinaten zijn ingevoerd ivm tonen foutmelding
      this.changeCoordinates.emit({
        id: this.searchValue,
        source: this.isRd ? LocationType.CoordinatenRD : LocationType.CoordinatenETRS89,
        name: this.searchValue,
        geometry: null,
      });
    }
  }

  public isCorrectCoordinates = (): boolean => {
    if (this.searchValue) {
      return !!this.searchService.getParsedCoordinates(this.searchValue, this.isRd);
    }
    return false;
  };
}
