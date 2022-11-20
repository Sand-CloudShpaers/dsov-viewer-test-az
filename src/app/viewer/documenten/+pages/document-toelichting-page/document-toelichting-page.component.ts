import { Component } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';

@Component({
  selector: 'dsov-document-toelichting-page',
  templateUrl: './document-toelichting-page.component.html',
  styleUrls: [],
})
export class DocumentToelichtingPageComponent {
  public documentDto$ = this.facade.currentDocumentDto$;
  public DOCUMENT_VIEW_CONTEXT = DocumentViewContext;
  public SUBPAGE_PATH = DocumentSubPagePath;

  constructor(private facade: DocumentenFacade) {}
}
