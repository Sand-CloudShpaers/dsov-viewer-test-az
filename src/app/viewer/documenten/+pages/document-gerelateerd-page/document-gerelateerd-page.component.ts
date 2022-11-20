import { Component, OnInit } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

@Component({
  selector: 'dsov-document-gerelateerd-page',
  templateUrl: './document-gerelateerd-page.component.html',
  styleUrls: ['./document-gerelateerd-page.component.scss'],
})
export class DocumentGerelateerdPageComponent implements OnInit {
  constructor(private documentenFacade: DocumentenFacade, private selectionFacade: SelectionFacade) {}
  public documentDto$ = this.documentenFacade.currentDocumentDto$;

  public ngOnInit(): void {
    this.selectionFacade.showSelectionsOnMap();
  }
}
