import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocatieFilterService, SearchingStatus } from '~viewer/filter/services/locatie-filter.service';
import { Observable } from 'rxjs';
import { LocatieFilter } from '~viewer/filter/types/filter-options';
import { SearchMode } from '~viewer/search/types/search-mode';
import { SearchFacade } from '~viewer/search/+state/search.facade';

@Component({
  selector: 'dsov-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public searchStatus$: Observable<SearchingStatus>;
  public searchMode = SearchMode;

  @Input() public searchModes: SearchMode[] = [SearchMode.LOCATIE, SearchMode.COORDINATEN, SearchMode.GEBIEDOPDEKAART];
  @Input() public locationFilter: LocatieFilter;
  @Input() public selectedMode: SearchMode;
  @Input() public autoSearch: boolean;
  @Input() public showRequiredError = false;
  @Input() public isTimeTravel = false;

  @Output() public changeLocation = new EventEmitter<LocatieFilter>();
  @Output() public changeCoordinates = new EventEmitter<LocatieFilter>();
  @Output() public changeContour = new EventEmitter<LocatieFilter>();

  constructor(private locatieFilterService: LocatieFilterService, private searchFacade: SearchFacade) {}

  ngOnInit(): void {
    // TODO 11-5-2022 is deze searchstatus nog nodig?
    this.searchStatus$ = this.locatieFilterService.searchStatus$;
  }

  public select(mode: SearchMode): boolean {
    this.selectedMode = mode;
    this.searchFacade.setSearchMode(mode);
    // leeg maken van suggestions
    this.locatieFilterService.suggestLocation();
    return false;
  }

  public trackBy(_index: number, item: string): string {
    return item;
  }
}
