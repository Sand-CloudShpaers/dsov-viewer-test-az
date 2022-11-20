import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApplicationPage, ApplicationTitle, ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { SearchingStatus } from '~viewer/filter/services/locatie-filter.service';
import { SearchMode } from '~viewer/search/types/search-mode';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { SearchFacade } from '~viewer/search/+state/search.facade';

@Component({
  selector: 'dsov-search-container',
  templateUrl: './search-container.component.html',
})
export class SearchContainerComponent implements OnInit {
  public selectedMode$ = this.searchFacade.searchMode$;
  public searchStatus$: Observable<SearchingStatus>;
  public searchMode: SearchMode[];

  constructor(
    protected route: ActivatedRoute,
    protected filterFacade: FilterFacade,
    protected titleService: Title,
    protected searchFacade: SearchFacade
  ) {}

  public ngOnInit(): void {
    this.titleService.setTitle(`Locatie bepalen - ${ApplicationTitle}`);
  }

  public changeLocatieFilter(locatie: LocatieFilter): void {
    this.filterFacade.updateFilters({ [FilterName.LOCATIE]: [locatie] }, [
      `${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`,
    ]);
  }

  public getTitle(selectedMode: SearchMode): string {
    switch (selectedMode) {
      case SearchMode.COORDINATEN:
        return 'Zoek coördinaten';
      case SearchMode.DOCUMENT:
        return 'Zoek document';
      case SearchMode.GEBIEDOPDEKAART:
        return 'Zoek gebied';
      default:
        return 'Zoek locatie';
    }
  }
}
