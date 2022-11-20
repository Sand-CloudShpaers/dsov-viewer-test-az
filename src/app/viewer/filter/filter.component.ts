import { Component, Input } from '@angular/core';
import { FilterFacade } from './filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Input() public showFilters = true;
  @Input() public readonly: boolean;
  @Input() public page: string;

  public FilterName = FilterName;

  public locatieFilter$ = this.filterFacade.locatieFilter$;
  public filterOptions$ = this.filterFacade.filterOptionsForLabels$;

  constructor(private filterFacade: FilterFacade) {}

  public showFilterPanel(): void {
    this.filterFacade.showFilterPanel();
  }
}
