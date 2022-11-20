import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { scrollToElement } from '~general/utils/dso-animations';
import { DocumentBodyElement, DocumentStructuurVM } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { DocumentenFacade } from '../../+state/documenten.facade';

@Component({
  selector: 'dsov-document-body',
  templateUrl: './document-body.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentBodyComponent implements OnInit {
  @Input() public documentId: string;
  @Input() public documentViewContext: DocumentViewContext;
  @Input() public documentStructuurVM: DocumentStructuurVM;
  @Input() public selectedElementId: string;

  constructor(private documentFacade: DocumentenFacade, @Inject(DOCUMENT) private document: Document) {}

  public ngOnInit(): void {
    if (this.selectedElementId) {
      setTimeout(() => scrollToElement(this.selectedElementId, document), 1);
    }
  }

  public emitCollapseChange($event: { open: boolean; id: string; documentId: string }): void {
    this.documentFacade.collapseElementChange($event.open, $event.documentId, $event.id);
  }

  public trackByFn(_index: number, item: DocumentBodyElement): string {
    return item.id;
  }
}
