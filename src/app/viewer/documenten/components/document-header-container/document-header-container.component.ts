import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-header-container',
  templateUrl: './document-header-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderContainerComponent implements OnChanges {
  @Input()
  public documentId: string;

  public documentVM$: Observable<DocumentVM>;

  constructor(private facade: DocumentenFacade) {}

  public ngOnChanges(): void {
    this.documentVM$ = this.facade.documentVM$(this.documentId);
  }
}
