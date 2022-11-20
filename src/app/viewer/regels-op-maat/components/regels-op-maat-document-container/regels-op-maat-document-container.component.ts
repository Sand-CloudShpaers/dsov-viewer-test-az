import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DerivedLoadingState } from '~general/utils/store.utils';

@Component({
  selector: 'dsov-regels-op-maat-document-container',
  templateUrl: './regels-op-maat-document-container.component.html',
})
export class RegelsOpMaatDocumentContainerComponent implements OnInit {
  @Input()
  public documentId: string;

  public documentVM$: Observable<DocumentVM>;
  public documentStatus$: Observable<DerivedLoadingState>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.documentStatus$ = this.documentenFacade.documentStatus$(this.documentId);
    this.documentVM$ = this.documentenFacade.documentVM$(this.documentId)?.pipe(
      filter(documentVM => documentVM.loadingState.isLoaded),
      take(1)
    );
  }
}
