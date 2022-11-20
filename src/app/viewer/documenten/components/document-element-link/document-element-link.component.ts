import { Component, Input } from '@angular/core';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-element-link',
  templateUrl: './document-element-link.component.html',
})
export class DocumentElementLinkComponent {
  @Input()
  public documentBodyElement: DocumentBodyElement;
}
