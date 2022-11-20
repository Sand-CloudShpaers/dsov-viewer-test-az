import { Injectable } from '@angular/core';
import LayerGroup from 'ol/layer/Group';
import { KaartlaagConfiguratie } from '~viewer/kaart/types/kaartlaag-configuratie';
import { SymboolLocatie } from '~store/common/selection/selection.model';

@Injectable({
  providedIn: 'root',
})
export class ImroPlanlagenServiceMock {
  public config: KaartlaagConfiguratie;
  private lagen: LayerGroup = new LayerGroup();

  public resetLagen(planIds: string[], add: boolean): LayerGroup {
    return this.lagen;
  }

  public resetStyle(symboolLocaties: SymboolLocatie[], laagId: string): void {}
}
