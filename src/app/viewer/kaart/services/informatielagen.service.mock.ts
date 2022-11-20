import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InformatielagenMockService {
  private opacityAllPlansSource$ = new BehaviorSubject<number>(0);
  public opacityAllPlans$ = this.opacityAllPlansSource$.asObservable();
  private opacityPlanBordersSource$ = new BehaviorSubject<number>(0);
  public opacityPlanBorders$ = this.opacityPlanBordersSource$.asObservable();
  private visibilityPercelenSource$ = new BehaviorSubject<boolean>(false);
  public visibilityPercelen$ = this.visibilityPercelenSource$.asObservable();

  public initializeInformatielagen(): BaseLayer[] {
    return [
      new ImageLayer({
        source: new ImageWMS({
          url: 'leukeurl',
          projection: 'EPSG:28992',
          params: {},
        }),
        visible: false,
      }),
    ];
  }
}
