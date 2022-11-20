import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentenStoreModule } from '~viewer/documenten/+state/documenten-store.module';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { State } from '~viewer/regels-op-maat/+state/index';
import * as RegelsOpMaatDocumentActions from '~viewer/regels-op-maat/+state/document/document.actions';
import * as fromRegelsOpMaatDocumenten from '~viewer/regels-op-maat/+state/document/document.selectors';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';
import * as fromRegelsOpMaat from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.selectors';
import { LoadMoreLinks } from '~viewer/regels-op-maat/types/load-more-links';
import { RegelsOpMaatDocument } from '~viewer/regels-op-maat/types/regels-op-maat-document';

@Injectable({
  providedIn: DocumentenStoreModule,
})
export class RegelsOpMaatFacade {
  public readonly documentIds$ = this.store.pipe(select(fromRegelsOpMaatDocumenten.selectDocumentIds));
  public readonly regelsOpMaatStatus$ = this.store.pipe(select(fromRegelsOpMaat.selectRegelsOpMaatStatus));

  public documentStatus$(documentId: string): Observable<DerivedLoadingState> {
    return this.store.pipe(select(fromRegelsOpMaatDocumenten.selectDocumentStatus(documentId)));
  }

  public selectRegelsOpMaatDocument$(documentId: string): Observable<RegelsOpMaatDocument> {
    return this.store.pipe(select(fromRegelsOpMaatDocumenten.selectDocument(documentId)));
  }

  public documentLoadMoreStatus$(documentId: string): Observable<DerivedLoadingState> {
    return this.store.pipe(select(fromRegelsOpMaatDocumenten.selectLoadMoreStatus(documentId)));
  }

  public documentLoadMoreLinks$(documentId: string): Observable<LoadMoreLinks> {
    return this.store.pipe(select(fromRegelsOpMaatDocumenten.selectLoadMore(documentId)));
  }

  constructor(private store: Store<State>) {}

  public loadRegelsOpMaat(): void {
    this.store.dispatch(RegelsOpMaatActions.resetRegelsOpMaat());
    this.store.dispatch(RegelsOpMaatActions.loadRegelsOpMaat());
  }

  public loadMoreRegelsOpMaat(document: DocumentDto): void {
    this.store.dispatch(RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocument({ document }));
  }
}
