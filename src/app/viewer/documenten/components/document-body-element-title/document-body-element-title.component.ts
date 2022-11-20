import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-document-body-element-title',
  templateUrl: './document-body-element-title.component.html',
  styleUrls: ['./document-body-element-title.component.scss'],
})
export class DocumentBodyElementTitleComponent {
  @Input() documentBodyElement: DocumentBodyElement;
  @Input() viewContext: DocumentViewContext;
  @Input() regelgevingtypes: RegelgevingtypeFilter[];
  @Output() public clickedToggle = new EventEmitter<void>();

  public DocumentViewContext = DocumentViewContext;

  public toggle(): void {
    this.clickedToggle.emit();
  }
}
