import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentStructuurVM, DocumentVM } from '~viewer/documenten/types/documenten.model';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { DerivedLoadingState } from '~general/utils/store.utils';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { LoadMoreLinks } from '~viewer/regels-op-maat/types/load-more-links';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { DocumentDto } from '~viewer/documenten/types/documentDto';

@Component({
  selector: 'dsov-regels-op-maat-document',
  templateUrl: './regels-op-maat-document.component.html',
  styleUrls: ['./regels-op-maat-document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegelsOpMaatDocumentComponent implements OnInit {
  @Input()
  public documentId: string;
  @Input()
  public documentVM: DocumentVM;

  public loadMoreLinks$: Observable<LoadMoreLinks>;
  public loadMoreStatus$: Observable<DerivedLoadingState>;

  public DOCUMENT_VIEW_CONTEXT = DocumentViewContext;

  public documentStructuurVM$: Observable<DocumentStructuurVM>;
  public documentStructuurStatus$: Observable<DerivedLoadingState>;

  constructor(private documentenFacade: DocumentenFacade, private regelsOpMaatFacade: RegelsOpMaatFacade) {}

  public ngOnInit(): void {
    this.loadMoreLinks$ = this.regelsOpMaatFacade.documentLoadMoreLinks$(this.documentId);
    this.loadMoreStatus$ = this.regelsOpMaatFacade.documentLoadMoreStatus$(this.documentId);
    const documentSubPagePaths = [
      DocumentSubPagePath.REGELS,
      DocumentSubPagePath.BESLUITTEKST,
      DocumentSubPagePath.BELEIDSTEKST,
    ];
    this.documentenFacade.loadDocumentStructuurForSelectedDocument(this.documentId, documentSubPagePaths);
    const romPath = documentSubPagePaths.filter(subPagePath =>
      this.documentVM.subPages.map(page => page.path).includes(subPagePath)
    )[0];
    this.documentStructuurStatus$ = this.documentenFacade.documentStructuurStatus$(this.documentId);
    this.documentStructuurVM$ = this.documentenFacade.documentStructuurVM$(
      this.documentId,
      this.DOCUMENT_VIEW_CONTEXT.REGELS_OP_MAAT,
      romPath,
      false
    );
  }

  public emitLoadMore(): void {
    this.regelsOpMaatFacade.loadMoreRegelsOpMaat(this.getDocumentDto());
  }

  public getDocumentDto(): DocumentDto {
    return {
      documentId: this.documentId,
      documentType: this.documentVM.type,
    };
  }
}
