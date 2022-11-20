import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subject } from 'rxjs';
import { filter, map, pluck, takeUntil } from 'rxjs/operators';
import BaseLayer from 'ol/layer/Base';
import { LayerSelection, LayerSwitcherLayer } from '~model/internal/maps/layer-switcher-layer';
import { KaartlaagUtils } from '~viewer/kaart/utils/kaartlaag-utils';
import { KaartService } from '~viewer/kaart/services/kaart.service';

@Component({
  selector: 'dsov-layer-switcher',
  templateUrl: './layer-switcher.component.html',
  styleUrls: ['./layer-switcher.component.scss'],
})
export class LayerSwitcherComponent implements OnInit, OnDestroy {
  public get layerCtrls(): FormArray {
    return this.formGroup.get('layers') as FormArray;
  }

  public get layers(): LayerSwitcherLayer[] {
    return this._layers;
  }

  @Input()
  public set layers(layers: LayerSwitcherLayer[]) {
    if (layers == null) {
      return;
    }

    if (this.formGroup == null) {
      this.formGroup = this.fb.group({
        layers: this.fb.array([]),
      });
    }

    this._layers = [...layers];
    this.formGroup.setControl('layers', this.fb.array(layers.map(layer => this.fb.group({ selected: layer.active }))));
  }

  @Output() public selection = new EventEmitter<LayerSwitcherLayer[]>();
  public editLayers: boolean[] = [];
  public formGroup: FormGroup;
  private onDestroy$ = new Subject<void>();

  private _layers: LayerSwitcherLayer[];

  constructor(private fb: FormBuilder, private kaartService: KaartService) {}

  public ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        pluck('layers'),
        filter((layers: LayerSelection[]) => layers != null),
        map(layers =>
          layers
            .map((layer, index) => ({ selected: layer.selected, article: this._layers[index] }))
            .filter(layer => layer.selected)
            .map(layer => layer.article)
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe(layers => {
        this.selection.next(layers);
      });
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public editLayer(i: number, editActive: boolean): void {
    this.editLayers[i] = editActive;
  }

  public doEditLayer(i: number): boolean {
    return this.editLayers[i] != null && this.editLayers[i];
  }

  public onOpacityChange(event: MatSliderChange, layer: LayerSwitcherLayer): void {
    KaartlaagUtils.getLayerByIdFromMap(this.kaartService.getMap(), layer.id)?.setOpacity(event.value);
  }

  // eslint-disable-next-line
  public getLayersByGroupName(groupName: string): any[] {
    return KaartlaagUtils.getLayersByGroupNameFromMap(this.kaartService.getMap(), groupName);
  }

  public onStyleChange(selectedLayer: BaseLayer): void {
    const layers = this.getLayersByGroupName(selectedLayer.getProperties()['groupName']);
    layers.forEach(layer => layer.setVisible(layer === selectedLayer));
  }

  public getOpacityOfLayer(id: string): number {
    return KaartlaagUtils.getLayerByIdFromMap(this.kaartService.getMap(), id).getOpacity();
  }

  public trackByFn(_index: number, item: AbstractControl): AbstractControl {
    return item;
  }

  // eslint-disable-next-line
  public trackByFnLayer(_index: number, item: any): any {
    return item;
  }
}
