import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LocationQueryParams } from '~store/common/navigation/types/query-params';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

@Component({
  selector: 'dsov-overzicht',
  templateUrl: './overzicht.component.html',
  styleUrls: ['./overzicht.component.scss'],
})
export class OverzichtComponent implements OnInit, OnDestroy {
  public ozonLocatiesStatus$ = this.ozonLocatiesFacade.getOzonLocatiesStatus$;
  public ozonLocatiesError$ = this.ozonLocatiesFacade.getOzonLocatiesError$;
  public themas$ = this.gegevenscatalogusProvider.getThemas$();
  public isDirty$ = this.filteredResultsFacade.getIsDirty$;
  public viewerPage = ViewerPage;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ozonLocatiesFacade: OzonLocatiesFacade,
    private navigationService: NavigationService,
    private selectionFacade: SelectionFacade,
    private gegevenscatalogusProvider: GegevenscatalogusProvider,
    private filterFacade: FilterFacade,
    private filteredResultsFacade: FilteredResultsFacade
  ) {}

  public ngOnInit(): void {
    this.selectionFacade.resetSelections(false);
    this.filterFacade.resetFilters([
      FilterName.ACTIVITEIT,
      FilterName.DOCUMENTEN,
      FilterName.THEMA,
      FilterName.GEBIEDEN,
    ]);
    this.filterFacade.setFiltersFromQueryParams(this.route.snapshot.queryParams);
  }

  public previousPage(): void {
    const queryParams: { [p: string]: null | string } = this.navigationService.getEmptyQueryParams(LocationQueryParams);
    if (this.route.snapshot.queryParams.datum) {
      this.filterFacade.setTimeTravelDate('');
    }
    this.router.navigate([ApplicationPage.VIEWER], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  public openPage(page: ViewerPage): void {
    this.navigationService.routeLocationNavigationPath(page);
  }

  public ngOnDestroy(): void {
    this.selectionFacade.resetSelections(false);
  }
}
