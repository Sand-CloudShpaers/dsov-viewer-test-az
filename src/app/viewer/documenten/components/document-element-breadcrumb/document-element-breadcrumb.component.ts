import { Component, Input, OnInit } from '@angular/core';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { Breadcrumb } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-document-element-breadcrumb',
  templateUrl: './document-element-breadcrumb.component.html',
  styleUrls: ['./document-element-breadcrumb.component.scss'],
})
export class DocumentElementBreadcrumbComponent implements OnInit {
  @Input() public breadcrumbs: Breadcrumb[] = [];
  @Input() public elementId: string;
  @Input() public documentId: string;

  public list: Breadcrumb[] = [];
  public expand = false;
  public routerLink: string[] = [];
  public selectedItem: Breadcrumb;

  constructor(private navigationFacade: NavigationFacade, private documentenFacade: DocumentenFacade) {}

  public ngOnInit(): void {
    this.list = this.breadcrumbs.filter(item => item.id !== this.elementId);
    this.routerLink = ['../' + ViewerPage.DOCUMENT, this.documentId, DocumentSubPagePath.REGELS];
  }

  public toggle(): void {
    this.expand = !this.expand;
  }

  public getBreadcrumbText(breadcrumb: Breadcrumb): string {
    return breadcrumb.titel;
  }

  public select(breadcrumb: Breadcrumb): void {
    this.documentenFacade.collapseSelectedElementTree(this.documentId, breadcrumb.id, this.breadcrumbs);
    this.navigationFacade.setNavigationPath(ViewerPage.REGELSOPMAAT, location.pathname);
  }

  public trackByFn(_index: number, item: Breadcrumb): string {
    return item.id;
  }
}
