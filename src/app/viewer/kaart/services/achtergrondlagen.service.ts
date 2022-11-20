import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import { KaartlaagConfiguratie } from '../types/kaartlaag-configuratie';
import { KaartlaagFactoryService } from './kaartlaag-factory.service';

@Injectable({
  providedIn: 'root',
})
export class AchtergrondlagenService {
  public achtergrondlagenConfig: KaartlaagConfiguratie[];
  public achtergrondlagen: BaseLayer[] = [];

  constructor(private kaartlaagFactoryService: KaartlaagFactoryService) {}

  public initializeAchtergrondlagen(): BaseLayer[] {
    this.achtergrondlagen = [];
    this.achtergrondlagenConfig = this.kaartlaagFactoryService.layerConfigFormat.achtergrondlagen;
    this.achtergrondlagenConfig.forEach(laagConfig => {
      this.achtergrondlagen.push(this.kaartlaagFactoryService.initializeLayer(laagConfig));
    });
    return this.achtergrondlagen;
  }

  public setAchtergrondlaag(achtergrondlaagId: string): void {
    this.achtergrondlagen.forEach(achtergrondlaag => {
      achtergrondlaag.setVisible(false);
    });
    this.achtergrondlagen.forEach(achtergrondlaag => {
      if (achtergrondlaagId === achtergrondlaag.get('id')) {
        achtergrondlaag.setVisible(true);
      }
    });
  }

  public setLayers(achtergrondlaagIds: string[]): void {
    this.achtergrondlagen.forEach(achtergrondlaag => {
      achtergrondlaag.setVisible(false);
    });
    achtergrondlaagIds.forEach(id => {
      const laag = this.achtergrondlagen.find(achtergrondlaag => achtergrondlaag.get('id') === id);
      if (laag) {
        laag.setVisible(true);
      }
    });
  }
}
