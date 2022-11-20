import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiSource } from '~model/internal/api-source';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { DocumentListItemVM } from '~viewer/filtered-results/types/document-list-item';
import { HighlightFacade } from '~store/common/highlight/+state/highlight.facade';
import { Selection } from '~store/common/selection/selection.model';
import { ContentService } from '~services/content.service';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';

@Component({
  selector: 'dsov-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
})
export class DocumentListItemComponent extends ContentComponentBase implements OnDestroy {
  @Input() public listItem: DocumentListItemVM;
  @Input() public index: number;
  public apiSource = ApiSource;

  constructor(
    private filterFacade: FilterFacade,
    private highlightFacade: HighlightFacade,
    private selectionFacade: SelectionFacade,
    protected contentService: ContentService
  ) {
    super(contentService);
  }

  public ngOnDestroy(): void {
    this.highlightFacade.cancelHighlight();
  }

  public highlight(show: boolean): void {
    show
      ? this.highlightFacade.startHighlight({
          id: this.listItem.id,
          selections: this.listItem.bundle,
          apiSource: this.listItem.apiSource,
        })
      : this.highlightFacade.cancelHighlight();
  }

  public getChecked$(): Observable<boolean> {
    const checked$ = this.selectionFacade.getSelectionByID$(this.listItem.id);
    return checked$ || of(false);
  }

  public onSelectionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.selectionFacade.addSelections(this.listItem.bundle);
    } else {
      this.selectionFacade.removeSelections(this.listItem.bundle);
    }
  }

  public openDocumentSelection(): void {
    this.filterFacade.openDocumentenFilter(this.listItem.bundle);
  }

  public hasOntwerpInBundle(bundle: Selection[]): boolean {
    return bundle.length > 1 && bundle.some(selection => selection.isOntwerp);
  }
}
