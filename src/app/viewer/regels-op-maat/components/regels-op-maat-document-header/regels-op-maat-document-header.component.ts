import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DocumentVM } from '~viewer/documenten/types/documenten.model';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { ApiSource } from '~model/internal/api-source';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { DocumentVMUtils } from '~viewer/documenten/utils/documentVM-utils';

@Component({
  selector: 'dsov-regels-op-maat-document-header',
  templateUrl: './regels-op-maat-document-header.component.html',
})
export class RegelsOpMaatDocumentHeaderComponent extends DocumentVMUtils implements OnChanges, OnInit {
  @Input() public document: DocumentVM;
  public ApiSource = ApiSource;
  public routerLink: string[];

  constructor(
    private navigationFacade: NavigationFacade,
    private documentenFacade: DocumentenFacade,
    private selectionFacade: SelectionFacade
  ) {
    super();
  }

  public ngOnChanges(): void {
    this.routerLink = ['../' + ViewerPage.DOCUMENT, this.document.documentId];

    if (this.document) {
      this.selectionFacade.addSelections([
        {
          id: this.document.documentId,
          documentDto: {
            documentId: this.document.documentId,
            documentType: this.document.type,
          },
          name: 'Document',
          apiSource: this.document.apiSource,
          isOntwerp: this.document.isOntwerp,
          objectType: SelectionObjectType.REGELINGSGEBIED,
          symboolcode: this.document.apiSource === ApiSource.OZON ? 'regelingsgebied' : 'plangebied_grens',
          locatieIds: ApiSource.IHR ? [this.document.documentId] : null,
        },
      ]);
    }
  }

  ngOnInit(): void {
    if (!this.document.extent) {
      this.documentenFacade.loadDocumentLocatie(this.document.documentId, this.document.locationHref);
    }
  }

  public onClickLinkToDocument(): void {
    this.navigationFacade.setNavigationPath(ViewerPage.REGELSOPMAAT, location.pathname);
    // Deze moet na merge van 5220 weg
    this.selectionFacade.resetSelections(false);
  }
}
