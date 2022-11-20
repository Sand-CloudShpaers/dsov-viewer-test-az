import { Component } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';

@Component({
  selector: 'dsov-document-kaarten-page',
  templateUrl: './document-kaarten-page.component.html',
  styleUrls: ['./document-kaarten-page.component.scss'],
})
export class DocumentKaartenPageComponent {
  public documentDto$ = this.documentenFacade.currentDocumentDto$;

  constructor(private documentenFacade: DocumentenFacade) {}
}
