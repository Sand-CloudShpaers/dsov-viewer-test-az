import { Component } from '@angular/core';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { LocatieFilter } from '~viewer/filter/types/filter-options';
import { FilterFacade } from '~viewer/filter/filter.facade';

@Component({
  selector: 'dsov-active-location',
  templateUrl: './active-location.component.html',
  styleUrls: ['./active-location.component.scss'],
})
export class ActiveLocationComponent {
  public activeLocation$ = this.filterFacade.locatieFilter$;

  constructor(private filterFacade: FilterFacade, private kaartService: KaartService) {}

  public zoomToLocation(activeLocation: LocatieFilter): void {
    this.kaartService.zoomToExtent(activeLocation.geometry.getExtent(), 200);
  }
}
