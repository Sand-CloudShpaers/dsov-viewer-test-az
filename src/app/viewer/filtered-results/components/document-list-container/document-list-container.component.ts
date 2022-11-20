import { Component, OnInit } from '@angular/core';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilteredResultsFacade } from '~viewer/filtered-results/+state/filtered-results.facade';

@Component({
  selector: 'dsov-document-list-container',
  templateUrl: './document-list-container.component.html',
  styleUrls: [],
})
export class DocumentListContainerComponent implements OnInit {
  public isDirty$ = this.filteredResultsFacade.getIsDirty$;

  constructor(
    private selectionFacade: SelectionFacade,
    private filterFacade: FilterFacade,
    private filteredResultsFacade: FilteredResultsFacade
  ) {}

  public ngOnInit(): void {
    this.selectionFacade.resetSelections(true);
    // voor IHR plannen
    this.selectionFacade.showSelectionsOnMap();
    this.filterFacade.resetFilters([FilterName.ACTIVITEIT, FilterName.DOCUMENTEN, FilterName.GEBIEDEN]);
  }
}
