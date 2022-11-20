import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiSource } from '~model/internal/api-source';
import { LoadingState } from '~model/loading-state.enum';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { Selection } from '~store/common/selection/selection.model';

@Component({
  selector: 'dsov-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
})
export class DocumentListComponent implements OnInit {
  // Als notAllFiltersApply dan worden alleen de ozon documenten gefilterd getoond
  // de IHR plannen worden apart getoond als mogelijk ook van toepassing
  public notAllFiltersApply$ = this.filteredResultsFacade.notAllFiltersApply$;
  public activeDocumentSelection$ = this.selectionFacade.getDocumentSelections$;
  public status$: Observable<LoadingState[]>;
  public apiSource = ApiSource;
  public Bestuurslaag = Bestuurslaag;
  public isLoadingSelection = false;

  constructor(
    private filteredResultsFacade: FilteredResultsFacade,
    private filterFacade: FilterFacade,
    private selectionFacade: SelectionFacade
  ) {}

  ngOnInit(): void {
    this.status$ = this.filteredResultsFacade.getStatus$();
    this.filteredResultsFacade.loadDocumenten();
  }

  public getBestuurslagen(): Bestuurslaag[] {
    return Object.values(Bestuurslaag);
  }

  public getSectionIsOpen$(bestuurslaag: Bestuurslaag): Observable<boolean> {
    return this.filteredResultsFacade.getSectionIsOpen$(bestuurslaag);
  }

  public getGroupTitle(bestuurslaag: Bestuurslaag): string {
    if (bestuurslaag !== Bestuurslaag.RIJK) {
      return bestuurslaag.charAt(0).toUpperCase() + bestuurslaag.slice(1);
    }
    return 'Het Rijk';
  }

  public viewSelection(selections: Selection[]): void {
    this.isLoadingSelection = true;
    this.filterFacade.openDocumentenFilter(selections);
  }

  public trackByBestuurslagen(_index: number, laag: Bestuurslaag): Bestuurslaag {
    return laag;
  }

  public allLoaded = (status: LoadingState[]): boolean => status.every(s => s === LoadingState.RESOLVED);
  public hasError = (status: LoadingState[]): boolean => status.some(s => s === LoadingState.REJECTED);
  public isPending = (status: LoadingState[]): boolean => status.some(s => s === LoadingState.PENDING);
}
