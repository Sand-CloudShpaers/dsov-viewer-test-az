import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from './index';
import * as PlannenActions from './plannen/plannen.actions';
import * as fromFilteredResults from './plannen.selectors';
import { FilteredResultsStoreModule } from './filtered-results-store.module';
import { Observable } from 'rxjs';
import { LoadingState } from '~model/loading-state.enum';
import { DocumentListItemVM } from '~viewer/filtered-results/types/document-list-item';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { getNotAllFiltersApply } from '~viewer/filter/+state/filter.selectors';

@Injectable({
  providedIn: FilteredResultsStoreModule,
})
export class FilteredResultsFacade {
  constructor(private store: Store<State>) {}

  public loadDocumenten(): void {
    this.store.dispatch(PlannenActions.load());
  }

  public readonly notAllFiltersApply$: Observable<boolean> = this.store.pipe(select(getNotAllFiltersApply));

  public readonly getIsDirty$ = this.store.pipe(select(fromFilteredResults.getIsDirty()));

  public readonly getLoadMoreUrls$ = (
    bestuurslaag?: Bestuurslaag
  ): Observable<{ bestuurslaag: Bestuurslaag; url: string }[]> =>
    this.store.pipe(select(fromFilteredResults.getLoadMoreUrls(bestuurslaag)));

  public readonly getStatus$ = (): Observable<LoadingState[]> =>
    this.store.pipe(select(fromFilteredResults.getStatus()));

  public readonly getDocumentListItemsVM$ = (bestuurslaag: Bestuurslaag): Observable<DocumentListItemVM[]> =>
    this.store.pipe(select(fromFilteredResults.getDocumentListItemsVM(bestuurslaag)));

  public readonly getAllDocumentListItemsVM$ = (): Observable<DocumentListItemVM[]> =>
    this.store.pipe(select(fromFilteredResults.getAllListItemsVM()));

  public readonly getSectionIsOpen$ = (bestuurslaag: Bestuurslaag): Observable<boolean> =>
    this.store.pipe(select(fromFilteredResults.getSectionIsOpen(bestuurslaag)));

  public toggleSection = (bestuurslaag: Bestuurslaag, open: boolean): void =>
    this.store.dispatch(PlannenActions.toggleSection({ bestuurslaag, open }));

  public resetState = (): void => this.store.dispatch(PlannenActions.reset());

  public loadMore = (bestuurslaag: Bestuurslaag, href: string): void =>
    this.store.dispatch(
      PlannenActions.ihrLoadMore({
        href,
        bestuurslaag,
      })
    );
}
