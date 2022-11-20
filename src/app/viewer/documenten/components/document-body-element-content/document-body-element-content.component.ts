import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-document-body-element-content',
  templateUrl: './document-body-element-content.component.html',
  styleUrls: ['./document-body-element-content.component.scss'],
})
export class DocumentBodyElementContentComponent {
  @Input() public element: DocumentBodyElement;
  @Input() regelgevingtypes: RegelgevingtypeFilter[];
  @Output() public handleAnchor = new EventEmitter<Event>();

  public faded = true;

  public toggleFaded(): void {
    this.faded = !this.faded;
  }

  public handleAnchorClick(event: Event): void {
    this.handleAnchor.emit(event);
  }

  public shouldBeDimmed(element: DocumentBodyElement): boolean {
    return element.layout.documentViewContext === DocumentViewContext.REGELS_OP_MAAT && !element.layout.isFiltered;
  }

  public isConditie(element: DocumentBodyElement): boolean {
    return element.type === DocumentBodyElementType.CONDITIEARTIKEL;
  }
}
