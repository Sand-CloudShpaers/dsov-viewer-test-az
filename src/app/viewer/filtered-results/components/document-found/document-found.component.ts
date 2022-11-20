import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingState } from '~model/loading-state.enum';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { DocumentListItemVM } from '~viewer/filtered-results/types/document-list-item';
import { ApiSource } from '~model/internal/api-source';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-found',
  templateUrl: './document-found.component.html',
  styleUrls: ['./document-found.component.scss'],
})
export class DocumentFoundComponent {
  @Input() public showButton: boolean;
  @Input() public notAllFiltersApply: boolean;
  @Output() public openPage = new EventEmitter<ViewerPage>();

  public notAllFiltersApply$ = this.filteredResultsFacade.notAllFiltersApply$;
  public viewerPage = ViewerPage;
  public filteredResults$ = this.filteredResultsFacade.getAllDocumentListItemsVM$();
  public filteredResultsStatus$ = this.filteredResultsFacade.getStatus$();
  public hasLoadMoreUrls$ = this.filteredResultsFacade.getLoadMoreUrls$();

  constructor(private filteredResultsFacade: FilteredResultsFacade) {}

  public canLoadMore(
    hasLoadMoreUrls: { bestuurslaag: Bestuurslaag; url: string }[],
    notAllFiltersApply: boolean
  ): boolean {
    // als notAllFiltersApply dan tellen de IHR plannen niet mee
    if (notAllFiltersApply) {
      return false;
    } else {
      // bij in elk geval 1 bestuurslaag is er een loadMoreUrl
      return hasLoadMoreUrls.length > 0;
    }
  }

  public getLength(list: DocumentListItemVM[]): number {
    if (this.notAllFiltersApply) {
      return list.filter(item => item.apiSource === ApiSource.OZON).length;
    }
    return list.length;
  }

  public allLoaded = (status: LoadingState[]): boolean => status.every(s => s === LoadingState.RESOLVED);
  public isPending = (status: LoadingState[]): boolean => status.some(s => s === LoadingState.PENDING);
}
