import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { NavigationPaths } from '~store/common/navigation/types/navigation-paths';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';

@Component({
  selector: 'dsov-regels-op-maat-page',
  templateUrl: './regels-op-maat-page.component.html',
  styleUrls: ['./regels-op-maat-page.component.scss'],
})
export class RegelsOpMaatPageComponent implements OnInit, OnDestroy {
  public previousPaths$ = this.navigationFacade.previousPaths$;
  public ozonLocatiesStatus$ = this.ozonLocatiesFacade.getOzonLocatiesStatus$;
  public ozonLocatiesError$ = this.ozonLocatiesFacade.getOzonLocatiesError$;
  public activatedRouteSnapshot: ActivatedRouteSnapshot;

  constructor(
    private selectionFacade: SelectionFacade,
    private navigationFacade: NavigationFacade,
    private filterFacade: FilterFacade,
    private route: ActivatedRoute,
    private router: Router,
    private documentenFacade: DocumentenFacade,
    private ozonLocatiesFacade: OzonLocatiesFacade
  ) {}

  public ngOnInit(): void {
    this.selectionFacade.resetSelections(true);
    this.activatedRouteSnapshot = this.route.snapshot;
    this.filterFacade.setFiltersFromQueryParams(this.activatedRouteSnapshot.queryParams);
    this.selectionFacade.setSelectionsFromFilters();
  }

  public back(previousPaths: NavigationPaths): void {
    if (previousPaths[ViewerPage.DOCUMENTEN]) {
      this.router.navigate([previousPaths[ViewerPage.DOCUMENTEN]], { queryParamsHandling: 'preserve' });
    } else if (previousPaths[ViewerPage.GEBIEDEN]) {
      this.router.navigate([previousPaths[ViewerPage.GEBIEDEN]], { queryParamsHandling: 'preserve' });
    } else if (previousPaths[ViewerPage.ACTIVITEITEN]) {
      this.router.navigate([previousPaths[ViewerPage.ACTIVITEITEN]], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate([ApplicationPage.VIEWER]);
    }
  }

  public ngOnDestroy(): void {
    this.selectionFacade.resetSelections(true);
    this.documentenFacade.collapseAllElements();
    this.documentenFacade.resetSelectedDocument();
  }
}
