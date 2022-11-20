import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-legend-item',
  templateUrl: './legend-item.component.html',
  styleUrls: ['./legend-item.component.scss'],
})
export class LegendItemComponent {
  @Input() public naam: string;
  @Input() public symboolcode: string;
}
