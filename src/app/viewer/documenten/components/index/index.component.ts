import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { DocumentBodyElement, DocumentStructuurVM } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

@Component({
  selector: 'dsov-index',
  templateUrl: './index.component.html',
})
export class IndexComponent implements OnInit {
  @Input() public document: DocumentDto;

  public documentStructuurVM$: Observable<DocumentStructuurVM>;
  public documentStructuurStatus$: Observable<DerivedLoadingState>;
  public routerLink$: Observable<string>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.documentenFacade.loadDocumentStructuurForSelectedDocument(this.document.documentId, [
      DocumentSubPagePath.REGELS,
    ]);
    this.documentStructuurStatus$ = this.documentenFacade.documentStructuurStatus$(this.document.documentId);
    this.documentStructuurVM$ = this.documentenFacade.documentStructuurVM$(
      this.document.documentId,
      DocumentViewContext.VOLLEDIG_DOCUMENT,
      DocumentSubPagePath.REGELS,
      false
    );
    this.routerLink$ = this.documentenFacade.filterTabRouterLink$(this.document.documentId);
  }

  public trackBy(_index: number, element: DocumentBodyElement): string {
    return element.id;
  }
}
