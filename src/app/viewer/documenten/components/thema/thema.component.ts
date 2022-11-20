import { Component, Input, OnInit } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { Thema } from '~ozon-model/thema';
import { Observable } from 'rxjs';
import { FilterType } from '~viewer/documenten/utils/document-utils';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

@Component({
  selector: 'dsov-thema',
  templateUrl: './thema.component.html',
  styleUrls: ['./thema.component.scss'],
})
export class ThemaComponent implements OnInit {
  @Input() public document: DocumentDto;
  @Input() public themas: Thema[];

  public routerLink$: Observable<string>;

  constructor(private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.routerLink$ = this.documentenFacade.filterTabRouterLink$(this.document?.documentId);
  }

  public onClickThema(thema: Thema): void {
    this.documentenFacade.setStructuurelementFilter({
      id: this.document.documentId,
      document: this.document,
      beschrijving: thema.waarde,
      themaId: thema.code,
      filterType: FilterType.thema,
    });
  }

  public trackByFn(_index: number, item: Thema): string {
    return item.code;
  }
}
