import { AfterViewInit, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { reverseDateString } from '~general/utils/date.utils';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { DatePickerDetail } from '~viewer/components/date-picker-container/date-picker-container.component';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { SearchContainerComponent } from '~viewer/filter/components/filter-location/search/search-container/search-container.component';
import { SearchMode } from '~viewer/search/types/search-mode';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { Observable } from 'rxjs';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { ConfigService } from '~services/config.service';

@Component({
  selector: 'dsov-search-with-date-container',
  templateUrl: './search-with-date-container.component.html',
  styleUrls: ['./search-with-date-container.component.scss'],
})
export class SearchWithDateContainerComponent extends SearchContainerComponent implements AfterViewInit {
  public selectedMode$: Observable<SearchMode>;
  public selectedMode: SearchMode;
  public dateIwt: Date; // datum in werking treding omgevingswet
  public activeLocationFilter: LocatieFilter;
  public datePickerDetail: DatePickerDetail;
  public showRequiredErrorDate = false;
  public showRequiredErrorSearch = false;
  public SearchMode = SearchMode;

  constructor(
    protected route: ActivatedRoute,
    protected filterFacade: FilterFacade,
    protected titleService: Title,
    protected searchFacade: SearchFacade,
    protected kaartService: KaartService,
    private configService: ConfigService
  ) {
    super(route, filterFacade, titleService, searchFacade);
    this.dateIwt = new Date(this.configService.config.iwt.date);
  }

  public ngAfterViewInit(): void {
    this.kaartService.toggleInteractions(false);
  }

  public setMode(event: SearchMode): void {
    this.selectedMode = event;
    this.kaartService.toggleInteractions(this.selectedMode === SearchMode.GEBIEDOPDEKAART);
    this.showRequiredErrorDate = false;
  }

  public changeLocation(locatieFilter: LocatieFilter): void {
    this.activeLocationFilter = locatieFilter;
  }

  public changeCoordinates(locatieFilter: LocatieFilter): void {
    this.activeLocationFilter = locatieFilter;
    this.openSuggestion();
  }

  public changeContour(locatieFilter: LocatieFilter): void {
    this.activeLocationFilter = locatieFilter;
    this.openSuggestion();
  }

  public openSuggestion(): void {
    this.showRequiredErrorDate = !this.datePickerDetail || !this.datePickerDetail.valueAsDate;
    this.showRequiredErrorSearch = !this.activeLocationFilter?.name;
    if (!this.showRequiredErrorDate && !this.showRequiredErrorSearch) {
      const timeTravelDate = reverseDateString(this.datePickerDetail.value); // DD-MM-YYYY => YYYY-MM-DD
      this.filterFacade.setTimeTravelDate(timeTravelDate);
      this.filterFacade.updateFilters({ [FilterName.LOCATIE]: [this.activeLocationFilter] }, [
        `${ApplicationPage.VIEWER}/${ViewerPage.OVERZICHT}`,
      ]);
    }
  }

  public getYesterday(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }

  public handleDateChanged(detail: DatePickerDetail): void {
    this.datePickerDetail = detail;
  }
}
