import { Component, OnInit } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

@Component({
  selector: 'dsov-document-inhoud-page',
  templateUrl: './document-inhoud-page.component.html',
  styleUrls: ['./document-inhoud-page.component.scss'],
})
export class DocumentInhoudPageComponent implements OnInit {
  public documentDto$ = this.documentenFacade.currentDocumentDto$;

  constructor(private documentenFacade: DocumentenFacade, private selectionFacade: SelectionFacade) {}

  public ngOnInit(): void {
    this.selectionFacade.showSelectionsOnMap();
  }
}
