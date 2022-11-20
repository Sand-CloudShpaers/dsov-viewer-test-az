import { Component, Input } from '@angular/core';
import striptags from 'striptags';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { DocumentBodyElement } from '~viewer/documenten/types/documenten.model';

@Component({
  selector: 'dsov-index-element',
  templateUrl: './index-element.component.html',
  styleUrls: ['./index-element.component.scss'],
})
export class IndexElementComponent {
  @Input() public documentId: string;
  @Input() public element: DocumentBodyElement;
  @Input() public routerLink: string;
  @Input() public niveau = 0;

  constructor(private documentenFacade: DocumentenFacade) {}

  public trackBy(_index: number, element: DocumentBodyElement): string {
    return element.id;
  }

  public clickElement(element: DocumentBodyElement): void {
    this.documentenFacade.collapseSelectedElementTree(this.documentId, element.id, element.breadcrumbs);
  }

  public getContent(content: string): string {
    return striptags(content);
  }

  public filterChildElements(element: DocumentBodyElement): DocumentBodyElement[] {
    if (!element.elementen) {
      return [];
    }
    return element.elementen.filter(x => x.layout.showTitle);
  }
}
