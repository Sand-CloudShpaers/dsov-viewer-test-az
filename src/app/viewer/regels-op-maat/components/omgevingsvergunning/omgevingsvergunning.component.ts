import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';

@Component({
  selector: 'dsov-omgevingsvergunning',
  templateUrl: './omgevingsvergunning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OmgevingsvergunningComponent implements OnInit {
  @Input()
  public documentId: string;
  public omgevingsvergunningDetails$: Observable<Omgevingsvergunning>;
  public document$: Observable<DocumentVM>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.document$ = this.documentenFacade.documentVM$(this.documentId);
  }
}
