import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { StructuurElementFilter } from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.model';
import { DocumentSubPagePath } from '~viewer/documenten/types/document-pages';
import { DocumentViewContext } from '~viewer/documenten/types/layout.model';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';

@Component({
  selector: 'dsov-document-structuur-page',
  templateUrl: './document-structuur-page.component.html',
})
export class DocumentStructuurPageComponent implements OnInit {
  public DOCUMENT_VIEW_CONTEXT = DocumentViewContext;
  public documentDto$ = this.documentenFacade.currentDocumentDto$;
  public routeUrl$ = this.route.url;

  constructor(
    private documentenFacade: DocumentenFacade,
    private route: ActivatedRoute,
    private selectionFacade: SelectionFacade
  ) {}

  public ngOnInit(): void {
    this.selectionFacade.showSelectionsOnMap();
  }

  public removeStructuurelementFilter(event: StructuurElementFilter): void {
    this.documentenFacade.removeStructuurelementFilter(event.id);
  }

  public getPath(routeUrl: UrlSegment[]): DocumentSubPagePath {
    return routeUrl[0].path as DocumentSubPagePath;
  }
}
