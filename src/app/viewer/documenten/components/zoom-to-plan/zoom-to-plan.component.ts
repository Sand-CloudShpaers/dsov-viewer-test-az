import { Component, Input, OnChanges } from '@angular/core';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { Extent } from 'ol/extent';

@Component({
  selector: 'dsov-zoom-to-plan',
  templateUrl: './zoom-to-plan.component.html',
})
export class ZoomToPlanComponent implements OnChanges {
  @Input()
  public documentId: string;
  @Input()
  public extent: Extent;
  @Input()
  public shouldZoom = false;

  constructor(private kaartService: KaartService) {}

  public ngOnChanges(): void {
    if (this.shouldZoom) {
      this.zoomToGebiedExtent();
    }
  }

  public zoomToGebiedExtent(): void {
    if (this.extent) {
      setTimeout(() => this.kaartService.zoomToExtent(this.extent), 200);
    }
  }
}
