import { Component, Input, OnInit } from '@angular/core';
import { DocumentVersieVM } from '~viewer/documenten/types/document-versie';

@Component({
  selector: 'dsov-document-versies-item',
  templateUrl: './document-versies-item.component.html',
  styleUrls: ['./document-versies-item.component.scss'],
})
export class DocumentVersiesItemComponent implements OnInit {
  @Input() documentVersie: DocumentVersieVM;
  @Input() isCurrent: boolean;
  @Input() isOntwerp: boolean;

  public isToekomstig: boolean;

  public ngOnInit(): void {
    this.isToekomstig = this.documentVersie.inWerkingOp?.date.getTime() > new Date().getTime();
  }
}
