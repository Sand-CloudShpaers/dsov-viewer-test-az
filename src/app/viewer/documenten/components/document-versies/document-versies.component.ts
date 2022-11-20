import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentVersieVM } from '~viewer/documenten/types/document-versie';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-versies',
  templateUrl: './document-versies.component.html',
  styleUrls: ['./document-versies.component.scss'],
})
export class DocumentVersiesComponent implements OnInit {
  @Input() public document: DocumentVM;
  @Output() public exit = new EventEmitter();

  public vastgesteldStatus$: Observable<DerivedLoadingState>;
  public vastgesteld$: Observable<DocumentVersieVM[]>;
  public ontwerpStatus$: Observable<DerivedLoadingState>;
  public ontwerp$: Observable<DocumentVersieVM[]>;

  constructor(private documentenFacade: DocumentenFacade, private navigationFacade: NavigationFacade) {}

  public ngOnInit(): void {
    this.vastgesteldStatus$ = this.documentenFacade.versiesVastgesteldStatus$();
    this.vastgesteld$ = this.documentenFacade.versiesVastgesteld$();
    this.ontwerpStatus$ = this.documentenFacade.versiesOntwerpStatus$();
    this.ontwerp$ = this.documentenFacade.versiesOntwerp$();

    this.documentenFacade.loadDocumentVersies(this.document?.documentId, this.document?.isOntwerp);
  }

  public openDocument(): void {
    this.navigationFacade.setNavigationPath(ViewerPage.DOCUMENT, location.pathname);
    this.documentenFacade.resetDocumentVersies();
    this.exit.emit();
  }

  public getQueryParams(item: DocumentVersieVM): Params {
    return {
      [TimeTravelQueryParams.GELDIG_OP]: item.geldigOp ? item.geldigOp.original : null,
      [TimeTravelQueryParams.BESCHIKBAAR_OP]: item.beschikbaarOp ? item.beschikbaarOp.original : null,
      [TimeTravelQueryParams.IN_WERKING_OP]: item.inWerkingOp ? item.inWerkingOp.original : null,
      isOntwerp: null,
    };
  }

  public trackBy(_index: number, document: DocumentVersieVM): number {
    return document.versie;
  }
}
