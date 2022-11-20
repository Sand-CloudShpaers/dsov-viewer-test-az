import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiSource } from '~model/internal/api-source';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { BekendmakingVM } from '~viewer/documenten/components/bekendmakingen/bekendmakingen.model';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { InhoudVM } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-inhoud-ihr',
  templateUrl: './inhoud-ihr.component.html',
})
export class InhoudIhrComponent implements OnInit {
  @Input() public document: DocumentDto;

  public inhoud$: Observable<InhoudVM>;
  public bekendmakingen$: Observable<BekendmakingVM[]>;
  public ApiSource = ApiSource;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.inhoud$ = this.documentenFacade.inhoud$(this.document.documentId);
    this.documentenFacade.loadIHRBekendmakingen(this.document.documentId);
    this.bekendmakingen$ = this.documentenFacade.bekendmakingen$(this.document.documentId);
  }

  public trackBy(_index: number, inhoud: { href: string; type: string }): string {
    return inhoud.href;
  }
}
