import { Injectable } from '@angular/core';
import Projection from 'ol/proj/Projection';
import { Extent } from 'ol/extent';

@Injectable({
  providedIn: 'root',
})
export class ProjectieService {
  private projectionExtent = [-285401.92, 22598.08, 595401.92, 903401.92];
  private projection = new Projection({
    code: 'EPSG:28992',
    units: 'm',
    extent: this.projectionExtent as Extent,
    getPointResolution: (resolution): number => resolution,
  });

  public getProjection(): Projection {
    return this.projection;
  }

  public getProjectionExtent(): number[] {
    return this.projectionExtent;
  }
}
