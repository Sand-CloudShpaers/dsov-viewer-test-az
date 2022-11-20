import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

@Component({
  selector: 'dsov-document-found-container',
  templateUrl: './document-found-container.component.html',
  styleUrls: [],
})
export class DocumentFoundContainerComponent implements OnInit {
  @Output() public openPage = new EventEmitter<ViewerPage>();

  constructor(private filteredResultsFacade: FilteredResultsFacade) {}

  public ngOnInit(): void {
    this.filteredResultsFacade.loadDocumenten();
  }

  public redirect(event: ViewerPage): void {
    this.openPage.emit(event);
  }
}
