import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FetchLocationInfoService } from '~viewer/kaart/services/fetch-location-info.service';
import { ZoekLocatieInfo, ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { Observable } from 'rxjs';
import { LocationType } from '~model/internal/active-location-type.model';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss'],
})
export class LocationInfoComponent implements OnInit {
  @Output() public search = new EventEmitter<void>();
  @Output() public infoLoaded = new EventEmitter<boolean>();
  @Input() public coordinates: number[];

  public locationInfo$: Observable<ZoekLocatieInfo>;
  public previousPaths$ = this.navigationFacade.previousPaths$;
  public ZoekLocatieSystem = ZoekLocatieSystem;
  public PDOKTTYPE = LocationType;
  public pathname = location.pathname;

  constructor(
    private fetchLocationService: FetchLocationInfoService,
    private filterFacade: FilterFacade,
    private navigationFacade: NavigationFacade
  ) {}

  public ngOnInit(): void {
    if (this.coordinates?.length) {
      this.locationInfo$ = this.fetchLocationService.getZoekLocatieInfo$(this.coordinates);
    }
  }

  public searchLocation(
    locationInfo: ZoekLocatieInfo,
    source: LocationType,
    previousPaths: NavigationPaths,
    currentPath: string
  ): void {
    this.search.next(null);
    let commands: string[] = [];
    const overzicht = [`${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`];

    if (!currentPath.includes(`${ApplicationPage.VIEWER}/`)) {
      // Vanaf het locatie-zoek scherm
      commands = overzicht;
    } else {
      if (currentPath.includes(ViewerPage.REGELSOPMAAT)) {
        // Vanaf het regels-op-maat scherm
        if (previousPaths[ViewerPage.GEBIEDEN]) {
          commands = [previousPaths[ViewerPage.GEBIEDEN]];
        } else if (previousPaths[ViewerPage.DOCUMENTEN]) {
          commands = [previousPaths[ViewerPage.DOCUMENTEN]];
        } else {
          commands = overzicht;
        }
      } else if (currentPath.includes(`/${ViewerPage.DOCUMENT}/`)) {
        // Vanaf het volledige document scherm
        commands = overzicht;
      }
    }
    let locatieFilter: LocatieFilter;
    switch (source) {
      case LocationType.CoordinatenRD:
        locatieFilter = {
          id: locationInfo.coordinaten.system,
          name: `${locationInfo.coordinaten[ZoekLocatieSystem.RD][0]}, ${
            locationInfo.coordinaten[ZoekLocatieSystem.RD][1]
          }`,
          geometry: null,
          source,
          coordinaten: {
            [locationInfo.coordinaten.system]: [
              locationInfo.coordinaten[ZoekLocatieSystem.RD][0],
              locationInfo.coordinaten[ZoekLocatieSystem.RD][1],
            ],
            system: locationInfo.coordinaten.system,
          },
        };
        break;
      case LocationType.Perceel:
        locatieFilter = {
          id: locationInfo.perceel.weergavenaam,
          name: locationInfo.perceel.weergavenaam,
          source,
          geometry: null,
        };
        break;
      case LocationType.Adres:
        locatieFilter = {
          id: locationInfo.adres.weergavenaam,
          name: locationInfo.adres.weergavenaam,
          source,
          geometry: null,
        };
        break;
      default:
        return;
    }
    this.filterFacade.updateFilters({ [FilterName.LOCATIE]: [locatieFilter] }, commands);
  }

  public getAddition(previousPaths: NavigationPaths, currentPath: string): string {
    let page: string;
    let results: string;

    if (currentPath.includes(ViewerPage.REGELSOPMAAT)) {
      if (previousPaths[ViewerPage.GEBIEDEN]) {
        page = 'Gebieden met regels';
        results = 'gebieden';
      } else if (previousPaths[ViewerPage.DOCUMENTEN]) {
        page = 'Documenten met regels';
        results = 'documenten';
      } else {
        page = 'Overzicht op uw locatie';
        results = 'gebieden';
      }
    }

    return page && results
      ? `Als u een andere locatie kiest gaat u terug naar ${page}. Daar ziet u welke ${results} van toepassing zijn op de nieuwe locatie.`
      : '';
  }
}
