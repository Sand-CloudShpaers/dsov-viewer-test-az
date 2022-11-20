import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { DrawSearchService } from '~viewer/search/services/draw-search.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { AnnotatiesFacade } from '~viewer/annotaties/+state/annotaties.facade';
import { ActiviteitenFacade } from '~viewer/overzicht/activiteiten/+state/activiteiten.facade';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { FilterName } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  public timeTravel = false;

  constructor(
    private route: ActivatedRoute,
    private filterFacade: FilterFacade,
    private drawSearchService: DrawSearchService,
    private kaartService: KaartService,
    private selectionFacade: SelectionFacade,
    private annotatiesFacade: AnnotatiesFacade,
    private activiteitenFacade: ActiviteitenFacade,
    private filteredResultsFacade: FilteredResultsFacade,
    private ozonLocatiesFacade: OzonLocatiesFacade
  ) {}

  public ngOnInit(): void {
    this.timeTravel = this.route.snapshot.queryParams[TimeTravelQueryParams.DATE] !== undefined;

    this.kaartService.setExtentToNL(this.kaartService.getMap());
    this.filterFacade.resetFilters([FilterName.LOCATIE]);
    this.drawSearchService.enableMapClick();
    this.selectionFacade.resetSelections(false);
    this.annotatiesFacade.resetState();
    this.activiteitenFacade.resetState();
    this.filteredResultsFacade.resetState();
    this.ozonLocatiesFacade.resetState();
    this.filterFacade.setFiltersFromQueryParams(this.route.snapshot.queryParams);
  }

  public back(): void {
    this.filterFacade.resetAllFilters([ApplicationPage.HOME]);
  }
}
