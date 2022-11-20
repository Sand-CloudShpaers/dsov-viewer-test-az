import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { RegelsbeleidType } from '~model/regel-status.model';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { FilterIdentification, FilterName, FilterOptions } from '~viewer/filter/types/filter-options';
import { equals, getCurrentFilterValuesOnChange } from '~viewer/filter/helpers/filters';

interface DocumenttypeForm {
  name: string;
  items: Documenttype[];
}

@Component({
  selector: 'dsov-filter-documenttype',
  templateUrl: './filter-documenttype.component.html',
  styleUrls: ['./filter-documenttype.component.scss'],
})
export class FilterDocumenttypeComponent implements OnInit {
  @Input() public filterItems: FilterIdentification[] = [];
  @Input() public filterName: FilterName;

  @Output() public filterSelected = new EventEmitter<FilterOptions>();

  public documenttypes$ = this.gegevenscatalogusProvider.getDocumenttypes$();
  public currentFilterValues: FilterIdentification[];

  public form: DocumenttypeForm[] = [];

  constructor(private gegevenscatalogusProvider: GegevenscatalogusProvider) {}

  public ngOnInit(): void {
    this.currentFilterValues = [...this.filterItems];
  }

  public getForm(documentTypes: Documenttype[]): DocumenttypeForm[] {
    return [
      {
        name: RegelsbeleidType.regels.name,
        items: documentTypes.filter(type => type.group === RegelsbeleidType.regels.id),
      },
      {
        name: RegelsbeleidType.beleid.name,
        items: documentTypes.filter(type => type.group === RegelsbeleidType.beleid.id),
      },
    ];
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
