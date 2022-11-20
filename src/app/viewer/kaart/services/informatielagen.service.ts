import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { KaartlaagConfiguratie } from '~viewer/kaart/types/kaartlaag-configuratie';

@Injectable({
  providedIn: 'root',
})
export class InformatielagenService {
  public informatielagenConfig: KaartlaagConfiguratie[];
  private informatielagen: BaseLayer[] = [];

  constructor(private kaartlaagFactoryService: KaartlaagFactoryService) {}

  public initializeInformatielagen(): BaseLayer[] {
    this.informatielagen = [];
    this.informatielagenConfig = this.kaartlaagFactoryService.layerConfigFormat.informatielagen;
    this.informatielagenConfig.forEach(laagConfig => {
      this.informatielagen.push(this.kaartlaagFactoryService.initializeLayer(laagConfig));
    });
    return this.informatielagen;
  }

  public setLayers(achtergrondlaagIds: string[]): void {
    this.informatielagen.forEach(informatielaag => {
      informatielaag.setVisible(false);
    });
    achtergrondlaagIds.forEach(id => {
      const laag = this.informatielagen.find(informatielaag => informatielaag.get('id') === id);
      if (laag) {
        laag.setVisible(true);
      }
    });
  }

  public getLayers(): BaseLayer[] {
    return this.informatielagen;
  }
}
