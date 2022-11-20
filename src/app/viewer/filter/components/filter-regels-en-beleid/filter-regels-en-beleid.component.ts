import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RegelsbeleidType } from '~model/regel-status.model';
import { FilterIdentification, FilterName, FilterOptions } from '~viewer/filter/types/filter-options';
import { equals, getCurrentFilterValuesOnChange } from '~viewer/filter/helpers/filters';
import { ContentComponentBase } from '~general/components/content-component-base/content-component-base';
import { ContentService } from '~services/content.service';

@Component({
  selector: 'dsov-filter-regels-en-beleid',
  templateUrl: './filter-regels-en-beleid.component.html',
  styleUrls: ['./filter-regels-en-beleid.component.scss'],
})
export class FilterRegelsEnBeleidComponent extends ContentComponentBase implements OnInit {
  @Input() public isTimeTravel: boolean;
  @Input() public filterItems: FilterIdentification[] = [];
  @Input() public filterName: FilterName;

  @Output() public filterSelected = new EventEmitter<FilterOptions>();

  constructor(protected contentService: ContentService) {
    super(contentService);
  }

  public currentFilterValues: FilterIdentification[];
  public showAll: boolean;

  public form: { id: string; name: string; items: FilterIdentification[] }[] = [
    {
      id: this.contentKeys.REGELTYPE,
      name: 'Type',
      items: [RegelsbeleidType.regels, RegelsbeleidType.beleid],
    },
  ];

  public ngOnInit(): void {
    this.currentFilterValues = [...this.filterItems];
    if (this.isTimeTravel) {
      this.form.pop();
    }
  }

  public isSelected(item: FilterIdentification): boolean {
    return this.currentFilterValues.some(i => equals(item, i));
  }

  public onChange(item: FilterIdentification, event: Event = null): void {
    this.currentFilterValues = getCurrentFilterValuesOnChange(item, this.currentFilterValues, event);
    this.filterSelected.emit({ [this.filterName]: this.currentFilterValues });
  }

  public trackByFilterBlock(_index: number, item: { name: string }): string {
    return item.name;
  }

  public trackByFilterItem(_index: number, item: FilterIdentification): string {
    return item.id;
  }
}
