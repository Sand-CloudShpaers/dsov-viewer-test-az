import { Component, Input } from '@angular/core';
import { getKeys } from '~general/utils/object.utils';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterIdentification, FilterName, FilterOptions } from '~viewer/filter/types/filter-options';
import { Selection } from '~store/common/selection/selection.model';

const FILTER_REMOVE_TIMEOUT = 10;

@Component({
  selector: 'dsov-filter-label',
  templateUrl: './filter-label.component.html',
  styleUrls: ['./filter-label.component.scss'],
})
export class FilterLabelComponent {
  public activeSelections$ = this.selectionFacade.getSelections$;

  @Input() public filterOptions: FilterOptions;
  @Input() public removable = true;

  constructor(private filterFacade: FilterFacade, private selectionFacade: SelectionFacade) {}

  public getFilterNames(): FilterName[] {
    return this.filterOptions ? getKeys(this.filterOptions) : [];
  }

  public getSymboolcode(id: string, activeSelections: Selection[]): string {
    return activeSelections?.find(item => id === item.id)?.symboolcode;
  }

  public removeFilter(name: FilterName, identification: FilterIdentification): void {
    setTimeout(() => {
      this.filterFacade.removeFilter({ name, filter: identification });
    }, FILTER_REMOVE_TIMEOUT);
  }

  public trackByName(_index: number, item: FilterName): string {
    return item;
  }

  public trackByFilter(_index: number, item: FilterIdentification): string {
    return item.id;
  }
}
