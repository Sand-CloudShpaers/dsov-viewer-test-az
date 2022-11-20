import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectableListVM, SelectableVM } from '../selectable-list/types/selectable-list-item';

@Component({
  selector: 'dsov-collapsible-list',
  templateUrl: './collapsible-list.component.html',
  styleUrls: ['./collapsible-list.component.scss'],
})
export class CollapsibleListComponent implements OnInit {
  @Input()
  public showCheckboxes: boolean;
  @Input()
  public showSliders: boolean;
  @Input()
  public identificatie: string;
  @Input()
  public naam: string;
  @Input()
  public lists: SelectableListVM[];
  @Input()
  public embedded: SelectableVM[] = [];
  @Input()
  public boldTitle = false;
  @Input()
  public set expanded(status: boolean) {
    this.isExpanded = this.isExpanded || status;
  }

  @Output()
  public toggleExpanded = new EventEmitter<boolean>();

  public isExpanded = false;

  public ngOnInit(): void {
    this.toggleExpanded.emit(this.isExpanded);
  }

  public toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.toggleExpanded.emit(this.isExpanded);
  }

  public trackByEmbeddedItem(_index: number, item: SelectableVM): string {
    return item.identificatie;
  }

  public trackByList(index: number, _item: SelectableListVM): number {
    return index;
  }
}
