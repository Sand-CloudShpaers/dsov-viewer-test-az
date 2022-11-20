import { Component, Input } from '@angular/core';
import { Selection } from '~store/common/selection/selection.model';
import { LegendGroupVM } from '../types/legend-group';

@Component({
  selector: 'dsov-legend-group',
  templateUrl: './legend-group.component.html',
  styleUrls: ['./legend-group.component.scss'],
})
export class LegendGroupComponent {
  @Input() public group: LegendGroupVM;

  public trackByFn(_index: number, selection: Selection): string {
    return selection.id;
  }
}
