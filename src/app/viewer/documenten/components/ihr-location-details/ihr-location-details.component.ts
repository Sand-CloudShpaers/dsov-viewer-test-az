import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FeatureLike } from 'ol/Feature';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';

@Component({
  selector: 'dsov-ihr-location-details',
  templateUrl: './ihr-location-details.component.html',
})
export class IhrLocationDetailsComponent implements OnChanges {
  @Input()
  public planId: string;

  @Input()
  public features: FeatureLike[];

  public changedFeatures: FeatureLike[];

  public mapDetailsStatus$ = this.mapDetailsFacade.mapDetailsStatus$;
  public detailsOpLocatie$ = this.mapDetailsFacade.mapDetails$;

  public error: Error = null;

  constructor(private mapDetailsFacade: MapDetailsFacade) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.changedFeatures = changes.features?.currentValue;
    if (this.changedFeatures && this.changedFeatures.length > 0) {
      this.mapDetailsFacade.loadCartografie(this.planId, this.changedFeatures);
    } else {
      this.mapDetailsFacade.resetMapDetails();
      this.mapDetailsFacade.showMapDetails([], this.planId);
    }
  }

  public trackByKeys(_index: number, key: string): string {
    return key;
  }
}
