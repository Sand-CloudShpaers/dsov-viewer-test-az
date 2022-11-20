import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

@Component({
  selector: 'dsov-gerelateerde-plannen-container',
  templateUrl: './gerelateerde-plannen-container.component.html',
  styleUrls: ['./gerelateerde-plannen-container.component.scss'],
})
export class GerelateerdePlannenContainerComponent implements OnInit {
  @Input()
  public document: DocumentDto;

  public status$: Observable<DerivedLoadingState> = this.documentenFacade.gerelateerdePlannenStatus$;

  public gerelateerdePlannen$: Observable<DocumentVM[]>;
  public gerelateerdVanuit$: Observable<DocumentVM[]>;
  public dossierPlannen$: Observable<DocumentVM[]>;

  constructor(private documentenFacade: DocumentenFacade) {}

  ngOnInit(): void {
    this.gerelateerdePlannen$ = this.documentenFacade.gerelateerdePlannen$(this.document.documentId);
    this.gerelateerdVanuit$ = this.documentenFacade.gerelateerdVanuit$(this.document.documentId);
    this.documentenFacade.loadGerelateerdePlannen(this.document.documentId);
    this.dossierPlannen$ = this.documentenFacade.getDossierPlannen$(this.document.documentId);
  }
}
