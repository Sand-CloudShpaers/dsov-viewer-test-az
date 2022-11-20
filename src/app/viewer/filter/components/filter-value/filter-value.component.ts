import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterIdentification, FilterName, FilterOptions } from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-filter-value',
  templateUrl: './filter-value.component.html',
  styleUrls: ['./filter-value.component.scss'],
})
export class FilterValueComponent implements OnInit {
  @Input() public filterItems: FilterIdentification[];
  @Input() public filterLabel: string;
  @Input() public filterName: FilterName;
  @Input() public filterOptions: FilterOptions;
  @Input() public singleSelect = false;
  @Output() public filterSelected = new EventEmitter<FilterOptions>();

  public currentFilterValues: FilterIdentification[];
  public showFilters: boolean;
  public showAll: boolean;

  public ngOnInit(): void {
    this.currentFilterValues = [...this.filterOptions[this.filterName]];
    this.showFilters = this.showAll = this.currentFilterValues.length > 0;
  }

  public equals(f1: FilterIdentification, f2: FilterIdentification): boolean {
    return f1?.id === f2?.id;
  }

  public getFilterItems(): FilterIdentification[] {
    if (this.showAll) {
      return this.filterItems;
    }
    return this.filterItems.slice(0, 3);
  }

  public isSelected(item: FilterIdentification): boolean {
    return this.currentFilterValues.some(i => this.equals(item, i));
  }

  public onChange(item: FilterIdentification, event: Event = null): void {
    if (!this.singleSelect) {
      const target = event.target as HTMLInputElement;
      if (target.checked) {
        this.currentFilterValues.push(item);
      } else {
        this.currentFilterValues = this.currentFilterValues.filter(i => !this.equals(item, i));
      }
    }
    this.filterSelected.emit({ [this.filterName]: this.currentFilterValues });
  }

  public toggleShowFilters(): void {
    this.showFilters = !this.showFilters;
  }

  public trackByFilterItem(_index: number, item: FilterIdentification): string {
    return item.id;
  }
}
