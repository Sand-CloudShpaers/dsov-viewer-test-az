import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { LocationQueryParams, TimeTravelQueryParams } from '~store/common/navigation/types/query-params';

@Component({
  selector: 'dsov-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent implements OnInit {
  public ozonLocatiesStatus$ = this.ozonLocatiesFacade.getOzonLocatiesStatus$;
  public ozonLocatiesError$ = this.ozonLocatiesFacade.getOzonLocatiesError$;
  public timeTravel = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private disableMapClickService: DisableMapClickService,
    private ozonLocatiesFacade: OzonLocatiesFacade,
    private navigationService: NavigationService,
    private filterFacade: FilterFacade,
    private kaartService: KaartService
  ) {}

  public ngOnInit(): void {
    this.disableMapClickService.close();
    this.filterFacade.setFiltersFromQueryParams(this.route.snapshot.queryParams);
    this.kaartService.toggleInteractions(true); // interactions kunnen evt uitgezet bij zoeken icm tijdreizen
    this.timeTravel = this.route.snapshot.queryParams[TimeTravelQueryParams.DATE] !== undefined;
  }

  public previousPage(): void {
    if (this.timeTravel) {
      this.router.navigate([ApplicationPage.VIEWER], {
        queryParams: {
          ...this.navigationService.getEmptyQueryParams(LocationQueryParams),
          ...this.navigationService.getEmptyQueryParams(TimeTravelQueryParams),
          [TimeTravelQueryParams.DATE]: '',
        },
        queryParamsHandling: 'merge',
      });
    } else {
      this.navigationService.routeLocationNavigationPath(ViewerPage.OVERZICHT);
    }
  }
}
