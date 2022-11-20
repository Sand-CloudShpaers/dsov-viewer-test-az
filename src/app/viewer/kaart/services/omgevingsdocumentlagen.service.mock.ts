import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

@Injectable({
  providedIn: 'root',
})
export class OmgevingsdocumentlagenMockService {
  public removeStyle(): void {}
  public resetStyle(): void {}

  public initDefault(): BaseLayer {
    return new ImageLayer({
      source: new ImageWMS({
        url: 'leukeurl',
        projection: 'EPSG:28992',
        params: {},
      }),
      visible: false,
    });
  }

  public initTimeTravel(): BaseLayer {
    return new ImageLayer({
      source: new ImageWMS({
        url: 'leukeurl',
        projection: 'EPSG:28992',
        params: {},
      }),
      visible: false,
    });
  }
}
