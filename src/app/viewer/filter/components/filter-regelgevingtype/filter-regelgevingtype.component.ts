import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterUtils } from '~general/utils/filter.utils';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { equals, getCurrentFilterValuesOnChange } from '~viewer/filter/helpers/filters';
import {
  FilterIdentification,
  FilterName,
  FilterOptions,
  RegelgevingtypeFilter,
  RegelgevingtypeItem,
} from '~viewer/filter/types/filter-options';

@Component({
  selector: 'dsov-filter-regelgevingtype',
  templateUrl: './filter-regelgevingtype.component.html',
  styleUrls: ['./filter-regelgevingtype.component.scss'],
})
export class FilterRegelgevingtypeComponent implements OnInit {
  @Input() public filterItems: FilterIdentification[] = [];
  @Input() public filterName: FilterName;

  @Output() public filterSelected = new EventEmitter<FilterOptions>();

  public regelgevingtypes$ = this.gegevenscatalogusProvider.getRegelgevingTypes$();
  public currentFilterValues: FilterIdentification[];

  constructor(private gegevenscatalogusProvider: GegevenscatalogusProvider) {}

  public ngOnInit(): void {
    this.currentFilterValues = [...this.filterItems];
  }

  public isSelected(item: RegelgevingtypeFilter): boolean {
    return this.currentFilterValues.some(i => equals(item, i));
  }

  public isItemSelected(item: RegelgevingtypeItem, filterItem: RegelgevingtypeFilter): boolean {
    return (this.currentFilterValues as RegelgevingtypeFilter[])
      .find(value => value.id === filterItem.id)
      .items.find(i => i.id === item.id).selected;
  }

  public onChangeFilterItem(filterItem: RegelgevingtypeFilter, event: Event = null): void {
    this.currentFilterValues = getCurrentFilterValuesOnChange(filterItem, this.currentFilterValues, event);
    this.emitFilterSelected();
  }

  public onChangeFilterItemItem(filterItem: RegelgevingtypeFilter, event: Event = null): void {
    const selectedItemId = (event.target as HTMLSelectElement).value;
    this.currentFilterValues = this.currentFilterValues.map(value => {
      const regelgevingtype = value as RegelgevingtypeFilter;
      if (regelgevingtype.id === filterItem.id) {
        regelgevingtype.items = filterItem.items.map((item: RegelgevingtypeItem) => {
          if (item.id === selectedItemId) {
            return { ...item, selected: true };
          }
          return { ...item, selected: false };
        });
      }
      return value;
    });
    this.emitFilterSelected();
  }

  public trackByFilterItem(_index: number, item: RegelgevingtypeFilter): string {
    return item.id;
  }

  public trackByItem(_index: number, item: RegelgevingtypeItem): string {
    return item.id;
  }

  private emitFilterSelected(): void {
    this.filterSelected.emit({
      [this.filterName]: this.currentFilterValues.map(value => {
        const regelgevingtype = value as RegelgevingtypeFilter;
        return {
          ...regelgevingtype,
          name: FilterUtils.getNameForRegelgevingType(regelgevingtype),
        };
      }),
    });
  }
}
