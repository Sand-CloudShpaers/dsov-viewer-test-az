import { Component, Input, OnInit } from '@angular/core';
import { fromEventPattern, Observable } from 'rxjs';
import { LayerName, LayerSwitcherLayer } from '~model/internal/maps/layer-switcher-layer';
import { map, pluck, startWith } from 'rxjs/operators';
import { AchtergrondlagenService } from '~viewer/kaart/services/achtergrondlagen.service';
import { InformatielagenService } from '~viewer/kaart/services/informatielagen.service';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { KaartlaagConfiguratie } from '~viewer/kaart/types/kaartlaag-configuratie';
import { Map as OlMap } from 'ol';

@Component({
  selector: 'dsov-layer-control',
  templateUrl: './layer-control.component.html',
  styleUrls: ['./layer-control.component.scss'],
})
export class LayerControlComponent implements OnInit {
  @Input() map: OlMap;

  public layerNames: LayerName[] = ['informatielagen', 'achtergrondlagen'];
  public layerNameLabels = { informatielagen: 'Informatie', achtergrondlagen: 'Achtergrond' };
  public layers: Map<LayerName, LayerSwitcherLayer[]>;
  public openLayers = this.layerNames;

  constructor(
    private achtergrondlagenService: AchtergrondlagenService,
    private informatielagenService: InformatielagenService,
    private kaartlaagFactoryService: KaartlaagFactoryService
  ) {}

  public ngOnInit(): void {
    this.layers = new Map<LayerName, LayerSwitcherLayer[]>();
    this.layerNames.forEach(layerName => {
      const layers: LayerSwitcherLayer[] = [];
      this.kaartlaagFactoryService.layerConfigFormat[layerName].forEach(laagConfig => {
        layers.push(this.createLayerFromLayerConfig(laagConfig));
      });
      this.layers.set(layerName, layers);
    });
  }

  public onChange(layerName: string, layers: LayerSwitcherLayer[]): void {
    if (layerName === 'achtergrondlagen') {
      this.achtergrondlagenService.setLayers(layers.map(layer => layer.id));
    } else {
      this.informatielagenService.setLayers(layers.map(layer => layer.id));
    }
  }

  public trackByFn(_index: number): number {
    return _index;
  }

  private createLayerFromLayerConfig(layerConfig: KaartlaagConfiguratie): LayerSwitcherLayer {
    return {
      id: layerConfig.id,
      title: layerConfig.layercontrol.title,
      active: layerConfig.initialVisible == null ? false : layerConfig.initialVisible,
      outOfZoom$: this.outOfZoom$(layerConfig),
      icon: layerConfig.layercontrol.icon,
      background: true,
      groupName: layerConfig.groupName,
    };
  }

  private outOfZoom$(layerConfig: KaartlaagConfiguratie): Observable<boolean> {
    return fromEventPattern(evt => this.map.getView().on('change:resolution', evt)).pipe(
      pluck('target'),
      map((view: any) => view.getResolution()), // eslint-disable-line
      startWith(this.map.getView().getResolution()),
      map(resolution => {
        if (layerConfig.maxResolution && layerConfig.minResolution) {
          return !(layerConfig.maxResolution > resolution && layerConfig.minResolution <= resolution);
        } else if (layerConfig.maxResolution) {
          return layerConfig.maxResolution <= resolution;
        } else if (layerConfig.minResolution) {
          return layerConfig.minResolution > resolution;
        } else {
          return false;
        }
      })
    );
  }
}
