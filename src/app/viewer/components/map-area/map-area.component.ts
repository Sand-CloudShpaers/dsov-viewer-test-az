import { Component } from '@angular/core';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { Map } from 'ol';

@Component({
  selector: 'dsov-map-area',
  templateUrl: './map-area.component.html',
  styleUrls: ['./map-area.component.scss'],
})
export class MapAreaComponent {
  public showPanel: boolean;
  public map$ = this.kaartService.initMap$();

  constructor(private kaartService: KaartService) {}

  public togglePanel(map: Map): void {
    this.showPanel = !this.showPanel;
    setTimeout(() => map.updateSize(), 1);
  }
}
