import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { SearchDocumentsConstraints } from '~search-documents/search-documents.enum';
import { DocumentSuggestion } from '~search-documents/types/document-suggestion';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { SearchDocumentsFacade } from '../../search-documents.facade';

@Component({
  selector: 'dsov-search-documents-suggest',
  templateUrl: './search-documents-suggest.component.html',
  styleUrls: ['./search-documents-suggest.component.scss'],
})
export class SearchDocumentsSuggestComponent implements OnInit, OnDestroy {
  @Input()
  public documentTypes: Documenttype[];

  @ViewChild('document_suggest__input')
  public suggestInput: HTMLInputElement;

  public suggestionStatus$: Observable<DerivedLoadingState> = this.searchDocumentsFacade.suggestionStatus$;
  public suggestions$: Observable<DocumentSuggestion[]>;
  public value: string;

  constructor(
    private router: Router,
    private searchDocumentsFacade: SearchDocumentsFacade,
    private navigationFacade: NavigationFacade
  ) {}

  public ngOnInit(): void {
    this.suggestions$ = this.searchDocumentsFacade.suggestions$(this.documentTypes);
  }

  public ngOnDestroy(): void {
    this.searchDocumentsFacade.resetSuggestions();
  }

  public search(event: Event): void {
    this.value = (event as CustomEvent).detail;
    this.searchDocumentsFacade.searchSuggestions(this.value);
  }

  public select(event: Event): void {
    const suggestion: DocumentSuggestion = (event as CustomEvent).detail;
    if (suggestion.id) {
      this.suggestInput.value = suggestion.value;
      this.navigationFacade.setNavigationPath(ViewerPage.DOCUMENT, location.pathname);
      this.router.navigate(
        [`${ApplicationPage.VIEWER}/${ViewerPage.DOCUMENT}`, suggestion.id],
        // Add query parameters with tijdreis parameters for Ozon suggestions
        suggestion.timeTravelDates
          ? {
              queryParams: {
                beschikbaarOp: suggestion.timeTravelDates.beschikbaarOp,
                inWerkingOp: suggestion.timeTravelDates.inWerkingOp,
                geldigOp: suggestion.timeTravelDates.geldigOp,
              },
            }
          : undefined
      );
    }
  }

  public getNumberOfResults(suggestions: DocumentSuggestion[]): string {
    if (suggestions.length > 1) {
      return `${suggestions.length} resultaten gevonden`;
    } else if (suggestions.length === 1) {
      return '1 resultaat gevonden';
    }
    return null;
  }

  public clear(): void {
    this.suggestInput.value = null;
  }

  public getNotFoundLabel(value: string): string {
    if (value.length < SearchDocumentsConstraints.MIN_CHARS) {
      return `Geen documenten gevonden. Probeer een (andere) zoekterm met meer dan ${value.length} karakter(s).`;
    }
    return 'Geen documenten gevonden. Probeer een (andere) zoekterm.';
  }
}
