import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { DocumentStructuurVM } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { PlanHeeftOnderdelenInner } from '~ihr-model/planHeeftOnderdelenInner';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { DocumentenFacade } from '../../+state/documenten.facade';
import { ApiUtils } from '~general/utils/api.utils';

@Component({
  selector: 'dsov-document-structuur-container',
  templateUrl: './document-structuur-container.component.html',
  styleUrls: ['./document-structuur-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentStructuurContainerComponent implements OnInit {
  @Input() public documentId: string;
  @Input() public documentViewContext: DocumentViewContext;
  @Input() public documentSubPagePath: DocumentSubPagePath = null;
  @Input() public expandedView: boolean;

  public DocumentViewContext = DocumentViewContext;
  public ApiUtils = ApiUtils;

  public documentStructuurVM$: Observable<DocumentStructuurVM>;
  public documentStructuurStatus$: Observable<DerivedLoadingState>;
  public inhoud$: Observable<PlanHeeftOnderdelenInner>;
  public selectedElementId$: Observable<string>;

  constructor(private documentFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    if (this.documentId) {
      this.documentFacade.loadDocumentStructuurForSelectedDocument(this.documentId, [this.documentSubPagePath]);
      this.documentStructuurStatus$ = this.documentFacade.documentStructuurStatus$(this.documentId);
      this.getDocumentStructuurVM();

      this.inhoud$ = this.documentFacade.inhoudBySubpage$(this.documentId, this.documentSubPagePath);
      this.selectedElementId$ = this.documentFacade.currentElementId$;
    }
  }

  public getTitleForInhoud(inhoud: PlanHeeftOnderdelenInner): string {
    const element = inhoud.heeftObjectgerichteTeksten.find(
      tekst => tekst.type.replace(/\s/g, '') === this.documentSubPagePath
    );
    return element?.titel || inhoud.type;
  }

  public toggleExpandedView = (status: boolean): void => {
    this.expandedView = status;
    this.getDocumentStructuurVM();
  };

  private getDocumentStructuurVM(): void {
    this.documentStructuurVM$ = this.documentFacade.documentStructuurVM$(
      this.documentId,
      this.documentViewContext,
      this.documentSubPagePath,
      this.expandedView
    );
  }
}
