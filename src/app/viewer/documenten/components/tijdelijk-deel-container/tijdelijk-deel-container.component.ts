import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-tijdelijk-deel-container',
  templateUrl: './tijdelijk-deel-container.component.html',
  styleUrls: ['./tijdelijk-deel-container.component.scss'],
})
export class TijdelijkDeelContainerComponent implements OnInit {
  @Input() public documentId: string;
  @Input() public documentType: string;
  @Input() public documentSubPagePath: DocumentSubPagePath = null;

  public heeftTijdelijkeDelen$: Observable<DocumentVM[]>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.heeftTijdelijkeDelen$ = this.documentenFacade.getTijdelijkeDelen$(this.documentId);
  }

  public trackByDeel(_index: number, deel: DocumentVM): string {
    return deel.documentId;
  }
}
