import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { AnnotationVM } from '~viewer/documenten/types/annotation';
import { DocumentBodyElement, DocumentBodyElementType } from '~viewer/documenten/types/documenten.model';
import { FilterOptions, RegelgevingtypeFilter } from '~viewer/filter/types/filter-options';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ApiUtils } from '~general/utils/api.utils';

@Component({
  selector: 'dsov-annotaties-container',
  templateUrl: './annotaties-container.component.html',
  styleUrls: ['./annotaties-container.component.scss'],
})
export class AnnotatiesContainerComponent implements OnInit {
  @Input() public element: DocumentBodyElement;
  @Input() public documentId: string;
  @Input() regelgevingtypes: RegelgevingtypeFilter[];
  @Input() public showAnnotation: boolean;

  public annotationLoaded: boolean;
  public annotation$: Observable<AnnotationVM>;
  public filterOptions$: Observable<FilterOptions>;

  constructor(private documentenFacade: DocumentenFacade, private filterFacade: FilterFacade) {}

  public ngOnInit(): void {
    this.annotation$ = this.documentenFacade.annotation$(this.documentId, this.element, this.regelgevingtypes);
    this.filterOptions$ = this.filterFacade.filterOptions$;
  }

  public toggleAnnotation(): void {
    if (!this.annotationLoaded) {
      if (ApiUtils.isOzonDocument(this.documentId)) {
        if ([DocumentBodyElementType.DIVISIE, DocumentBodyElementType.DIVISIETEKST].includes(this.element.type)) {
          this.documentenFacade.loadDivisieAnnotatie(
            this.documentId,
            this.element.id,
            this.element.annotationLink,
            this.element.isOntwerp
          );
        } else {
          this.documentenFacade.loadRegeltekst(
            this.documentId,
            this.element.id,
            this.element.annotationLink,
            this.element.isOntwerp
          );
        }
      }
      this.annotationLoaded = true;
    } else {
      this.annotationLoaded = false;
    }
    this.documentenFacade.toggleAnnotation(this.documentId, this.element.id);
  }
}
