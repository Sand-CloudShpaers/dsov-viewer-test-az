import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectableListItemVM } from '../types/selectable-list-item';

@Component({
  selector: 'dsov-selectable-list-item',
  templateUrl: './selectable-list-item.component.html',
  styleUrls: ['./selectable-list-item.component.scss'],
})
export class SelectableListItemComponent {
  @Input() public item: SelectableListItemVM;
  @Input() public active: boolean;
  @Input() public showCheckbox: boolean;
  @Input() public showSlider: boolean;

  @Output()
  public selectionChange = new EventEmitter<{ item: SelectableListItemVM; checked: boolean }>();
  @Output()
  public toggleHighlight = new EventEmitter<boolean>();

  public addHighlight(): void {
    this.toggleHighlight.emit(true);
  }

  public removeHighlight(): void {
    this.toggleHighlight.emit(false);
  }

  public onToggleCheckbox(item: SelectableListItemVM, event: Event): void {
    this.selectionChange.emit({ item, checked: (event.target as HTMLInputElement).checked });
  }

  public onToggleSlider(item: SelectableListItemVM, checked: boolean): void {
    this.selectionChange.emit({ item, checked });
  }
}
