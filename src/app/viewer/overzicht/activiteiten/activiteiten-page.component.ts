import { Component, OnInit } from '@angular/core';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

@Component({
  selector: 'dsov-activiteiten-page',
  templateUrl: './activiteiten-page.component.html',
  styleUrls: ['./activiteiten-page.component.scss'],
})
export class ActiviteitenPageComponent implements OnInit {
  public ozonLocatiesStatus$ = this.ozonLocatiesFacade.getOzonLocatiesStatus$;
  public ozonLocatiesError$ = this.ozonLocatiesFacade.getOzonLocatiesError$;
  public isDirty$ = this.filteredResultsFacade.getIsDirty$;

  constructor(
    private ozonLocatiesFacade: OzonLocatiesFacade,
    private filterFacade: FilterFacade,
    private navigationService: NavigationService,
    private filteredResultsFacade: FilteredResultsFacade
  ) {}

  public ngOnInit(): void {
    this.filterFacade.resetFilters([
      FilterName.ACTIVITEIT,
      FilterName.DOCUMENTEN,
      FilterName.THEMA,
      FilterName.GEBIEDEN,
    ]);

    this.filteredResultsFacade.loadDocumenten();
  }

  public openPage(page: ViewerPage): void {
    this.navigationService.routeLocationNavigationPath(page);
  }

  public previousPage(): void {
    this.navigationService.routeLocationNavigationPath(ViewerPage.OVERZICHT);
  }
}
