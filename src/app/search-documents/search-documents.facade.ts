import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from '~store/state';
import * as fromSelector from './+state/search-documents.selectors';
import * as SearchDocumentsActions from './+state/search-documents.actions';
import { DocumentSuggestion } from './types/document-suggestion';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';

@Injectable({ providedIn: 'root' })
export class SearchDocumentsFacade {
  constructor(private store: Store<State>) {}

  public readonly suggestionStatus$: Observable<DerivedLoadingState> = this.store.select(
    fromSelector.getSuggestionStatus
  );

  public suggestions$ = (documentTypes: Documenttype[]): Observable<DocumentSuggestion[]> =>
    this.store.select(fromSelector.getSuggestions(documentTypes));

  public searchSuggestions = (value: string): void =>
    this.store.dispatch(SearchDocumentsActions.SearchSuggestions({ value }));

  public resetSuggestions = (): void => this.store.dispatch(SearchDocumentsActions.ResetSuggestions());
}
