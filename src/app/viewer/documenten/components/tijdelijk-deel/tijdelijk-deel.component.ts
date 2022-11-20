import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';

@Component({
  selector: 'dsov-tijdelijk-deel',
  templateUrl: './tijdelijk-deel.component.html',
  styleUrls: ['./tijdelijk-deel.component.scss'],
})
export class TijdelijkDeelComponent implements OnInit {
  @Input() public tijdelijkDeel: DocumentVM;
  @Input() public documentSubPagePath: DocumentSubPagePath = null;

  public DOCUMENT_VIEW_CONTEXT = DocumentViewContext;
  public documentStatus$: Observable<DerivedLoadingState>;
  public documentStructuurStatus$: Observable<DerivedLoadingState>;
  public showAllFeatures = false;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.documentStatus$ = this.documentenFacade.documentStatus$(this.tijdelijkDeel.documentId);
    this.documentenFacade.loadDocument(
      { documentId: this.tijdelijkDeel.documentId, documentType: this.tijdelijkDeel.type },
      false
    );
  }

  public toggleFeatures(): void {
    this.showAllFeatures = !this.showAllFeatures;
  }
}
