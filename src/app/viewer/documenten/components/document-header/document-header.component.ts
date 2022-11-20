import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PlanOndergrondenInner } from '~ihr-model/planOndergrondenInner';
import { ApiSource } from '~model/internal/api-source';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { DocumentVM, ProcedurestapVM } from '~viewer/documenten/types/documenten.model';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentVMUtils } from '~viewer/documenten/utils/documentVM-utils';
import { Title } from '@angular/platform-browser';
import { ApplicationTitle } from '~store/common/navigation/types/application-page';
import { Observable } from 'rxjs';
import { BekendmakingVM } from '../bekendmakingen/bekendmakingen.model';

@Component({
  selector: 'dsov-document-header',
  templateUrl: './document-header.component.html',
})
export class DocumentHeaderComponent extends DocumentVMUtils implements OnChanges, OnInit, OnDestroy {
  @Input() public document: DocumentVM;
  public showAllFeatures = false;
  public showAllVersions = false;
  public ApiSource = ApiSource;
  public bekendmakingen$: Observable<BekendmakingVM[]>;

  constructor(
    private selectionFacade: SelectionFacade,
    private documentenFacade: DocumentenFacade,
    private titleService: Title
  ) {
    super();
  }

  public ngOnChanges(): void {
    if (this.document) {
      this.handleDocument();
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

  public ngOnInit(): void {
    this.handleDocument();
  }

  public ngOnDestroy(): void {
    this.documentenFacade.resetDocumentVersies();
  }

  public toggleFeatures(): void {
    this.showAllFeatures = !this.showAllFeatures;
  }

  public toggleVersies(): void {
    this.showAllVersions = !this.showAllVersions;
  }

  public isToekomstig(): boolean {
    if (!this.document.inwerkingVanaf) {
      return false;
    }
    return this.document.inwerkingVanaf.getTime() > new Date().getTime();
  }

  public trackByProcedureStap(_index: number, stap: ProcedurestapVM): string {
    return stap.soortStap.code;
  }

  public trackByOndergronden(_index: number, item: PlanOndergrondenInner): string {
    return item.type;
  }

  public trackByBekendmaking(_index: number, item: BekendmakingVM): string {
    return item.href;
  }

  private handleDocument(): void {
    if (!this.document.extent) {
      this.documentenFacade.loadDocumentLocatie(this.document.documentId, this.document.locationHref);
    }

    this.titleService.setTitle(`${this.document.title} - ${ApplicationTitle}`);

    if (this.document.apiSource === ApiSource.IHR) {
      this.documentenFacade.loadIHRBekendmakingen(this.document.documentId);
      this.bekendmakingen$ = this.documentenFacade.bekendmakingen$(this.document.documentId);
    }
  }
}
