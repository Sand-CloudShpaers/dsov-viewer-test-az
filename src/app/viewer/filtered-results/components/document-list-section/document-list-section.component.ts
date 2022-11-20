import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiSource } from '~model/internal/api-source';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { DocumentListItemVM } from '~viewer/filtered-results/types/document-list-item';

@Component({
  selector: 'dsov-document-list-section',
  templateUrl: './document-list-section.component.html',
  styleUrls: ['./document-list-section.component.scss'],
})
export class DocumentListSectionComponent implements OnInit {
  @Input() public notAllFiltersApply: boolean;
  @Input() public listTitle: string;
  @Input() public bestuurslaag: Bestuurslaag;
  @Input() public open: boolean;

  public documentListItems$: Observable<DocumentListItemVM[]>;

  public loadMoreUrls$: Observable<{ bestuurslaag: Bestuurslaag; url: string }[]>;

  public constructor(private filteredResultsFacade: FilteredResultsFacade, private filterFacade: FilterFacade) {}

  public ngOnInit(): void {
    this.documentListItems$ = this.bestuurslaag
      ? // op basis van bestuurslaag
        this.filteredResultsFacade.getDocumentListItemsVM$(this.bestuurslaag)
      : // in het geval van 'Overige documenten', de documenten die niet overeenkomen met het gekozen filter
        this.filteredResultsFacade.getAllDocumentListItemsVM$();
    this.loadMoreUrls$ = this.filteredResultsFacade.getLoadMoreUrls$(this.bestuurslaag);
  }

  public getListLength(list: DocumentListItemVM[]): number {
    if (this.notAllFiltersApply) {
      return list.filter(item => item.apiSource === ApiSource.OZON).length;
    }
    return list.length;
  }

  public getListHasLength(list: DocumentListItemVM[]): boolean {
    return this.getListLength(list) > 0;
  }

  public getSortedDocuments(list: DocumentListItemVM[]): DocumentListItemVM[] {
    if (this.notAllFiltersApply) {
      list = list.filter(item => item.apiSource === ApiSource.OZON);
    }
    // sort ByDate
    return list.slice().sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  }

  public getNotFoundTekst(bestuurslaag: Bestuurslaag): string {
    let documentType = '';
    switch (bestuurslaag) {
      case Bestuurslaag.GEMEENTE:
        documentType = 'gemeentelijke ';
        break;
      case Bestuurslaag.PROVINCIE:
        documentType = 'provinciale ';
        break;
      case Bestuurslaag.WATERSCHAP:
        documentType = 'waterschaps';
        break;
      case Bestuurslaag.RIJK:
        documentType = 'rijks';
        break;
      default:
    }

    return `Er zijn geen ${documentType}documenten gevonden die voldoen aan uw keuzes.`;
  }

  public canLoadMore(loadMoreUrls: { bestuurslaag: Bestuurslaag; url: string }[]): boolean {
    // als notAllFiltersApply dan tellen de IHR plannen niet mee
    if (this.notAllFiltersApply) {
      return false;
    } else {
      return loadMoreUrls.length > 0;
    }
  }

  public toggleSection(open: boolean): void {
    this.filteredResultsFacade.toggleSection(this.bestuurslaag, !open);
  }

  public loadMoreForAllBestuurslagen(urlsPerBestuurslaag: { bestuurslaag: Bestuurslaag; url: string }[]): void {
    urlsPerBestuurslaag.forEach(bestuurslaagUrl => {
      this.filteredResultsFacade.loadMore(bestuurslaagUrl.bestuurslaag, bestuurslaagUrl.url);
    });
  }

  public trackByDocumentListItem(_index: number, item: DocumentListItemVM): string {
    return item.id;
  }

  public triggerFilter = (): void => this.filterFacade.showFilterPanel();
}
