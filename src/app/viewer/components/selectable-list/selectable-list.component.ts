import { Component, Input } from '@angular/core';
import { HighlightFacade } from '~store/common/highlight/+state/highlight.facade';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { SelectableListItemVM, SelectableListVM } from './types/selectable-list-item';

@Component({
  selector: 'dsov-selectable-list',
  templateUrl: './selectable-list.component.html',
  styleUrls: ['./selectable-list.component.scss'],
})
export class SelectableListComponent {
  @Input()
  public showCheckboxes: boolean;
  @Input()
  public showSliders: boolean;
  @Input()
  public list: SelectableListVM;

  constructor(private selectionFacade: SelectionFacade, private highlightFacade: HighlightFacade) {}

  public showSlider(id: string): boolean {
    if (this.list.group) {
      return false;
    } else if (this.list.items.filter(l => l.isInFilter && l.id === id).length) {
      return false;
    } else {
      return this.showSliders;
    }
  }

  public onSelectionChange(items: SelectableListItemVM[], checked: boolean): void {
    if (checked) {
      this.selectionFacade.addSelections(items);
    } else {
      this.selectionFacade.removeSelections(items);
    }
  }

  public onHighlight(items: SelectableListItemVM[], highlight: boolean): void {
    highlight
      ? this.highlightFacade.startHighlight({
          id: items.length > 1 ? items.map(item => item.id).join(', ') : items[0].id,
          selections: items,
          apiSource: items[0].apiSource,
        })
      : this.highlightFacade.cancelHighlight();
  }

  public getGroupedItem(): SelectableListItemVM {
    return {
      id: this.list.group.identificatie,
      name: this.list.group.naam,
      apiSource: this.list.group.apiSource,
      isSelected: this.list.items.every(x => x.isSelected),
      symboolcode: this.list.group.symboolcode,
      objectType: this.list.items[0].objectType,
    };
  }

  public trackByListItem(_index: number, item: SelectableListItemVM): string {
    return item.id;
  }
}
