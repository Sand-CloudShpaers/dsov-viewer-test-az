import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ApiSource } from '~model/internal/api-source';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';
import { ImopNodeType } from '~viewer/documenten/types/imop-nodetypes';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { OverlayFacade } from '~viewer/overlay/+state/overlay.facade';

interface AnchorClickDetail {
  documentComponent: string;
  node: ImopNodeType;
}

@Component({
  selector: 'dsov-document-body-element',
  templateUrl: './document-body-element.component.html',
  styleUrls: ['./document-body-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentBodyElementComponent implements OnInit {
  @HostBinding('attr.aria-expanded') public expanded = 'false';
  @HostBinding('id') public id = '';
  @Input() public documentId: string;
  @Input() public viewContext: DocumentViewContext;
  @Input() collapsibleElementId: string;
  @Output() public collapseChange = new EventEmitter<{ open: boolean; id: string; documentId: string }>();
  public regelgevingtypes$ = this.gegevenscatalogusProvider.getRegelgevingTypes$();
  public showAnnotation = false;

  constructor(
    private documentFacade: DocumentenFacade,
    private overlayFacade: OverlayFacade,
    private gegevenscatalogusProvider: GegevenscatalogusProvider
  ) {}

  private _documentBodyElement?: DocumentBodyElement;

  public get documentBodyElement(): DocumentBodyElement {
    return this._documentBodyElement;
  }

  @Input()
  public set documentBodyElement(input: DocumentBodyElement) {
    this._documentBodyElement = input;
    const expanded = input?.layout?.isOpen ?? false;
    this.expanded = Boolean(expanded).toString();
    this.id = input?.id;
  }

  public ngOnInit(): void {
    this.loadChildren(this._documentBodyElement);
  }

  public collapseChangeToggle(): void {
    this.collapseChange.emit({
      open: !this.documentBodyElement.layout.isOpen,
      id: this.documentBodyElement.id,
      documentId: this.documentBodyElement.documentId,
    });
  }

  public collapseChangeEventHandler($event: { open: boolean; id: string; documentId: string }): void {
    this.collapseChange.emit($event);
  }

  public handleAnchorClick(event: Event): void {
    const detail = (event as CustomEvent).detail as AnchorClickDetail;

    if (detail.documentComponent) {
      this.overlayFacade.openLink(this.documentId, detail.documentComponent, detail.node);
    }
  }

  public trackByFn(_index: number, item: DocumentBodyElement): string {
    return item.id;
  }

  private loadChildren(element: DocumentBodyElement): void {
    if (element?.apiSource === ApiSource.IHR) {
      if (element.elementen?.length === 0 && element.hasChildren) {
        this.documentFacade.loadIHRDocumentStructuurForSelectedTekst(this.documentId, element.id);
      }
    }
  }
}
