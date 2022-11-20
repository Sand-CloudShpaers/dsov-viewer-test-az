import { Injectable } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { FeatureLike } from 'ol/Feature';
import { defaults, DoubleClickZoom, KeyboardZoom, MouseWheelZoom, PinchZoom } from 'ol/interaction';
import { Coordinate } from 'ol/coordinate';
import { BehaviorSubject, Subject } from 'rxjs';
import { MaxExtent } from '~general/utils/geo.utils';

@Injectable({ providedIn: 'root' })
export class KaartServiceMock {
  public map: Map;
  private _featuresAtLocation: Subject<FeatureLike[]> = new BehaviorSubject<FeatureLike[]>([{} as FeatureLike]);

  public get featuresAtLocation(): Subject<FeatureLike[]> {
    return this._featuresAtLocation;
  }

  public resetFeaturesAtLocation(): void {
    this._featuresAtLocation = new BehaviorSubject<FeatureLike[]>([{} as FeatureLike]);
  }

  public setExtentToNL(map: Map): void {}

  public getMap(): Map {
    if (!this.map) {
      this.map = this.createNewMap();
    }
    return this.map;
  }

  public panToCoordinate(coordinate: Coordinate): void {}

  public zoomToExtent(extent: number[]): void {}

  public addMarker(coordinate: Coordinate, markerSource: string): void {}

  public removePin(): void {}

  private createNewMap(): Map {
    const map = new Map({
      view: new View({
        constrainResolution: true,
        extent: [MaxExtent.MIN_X, MaxExtent.MIN_Y, MaxExtent.MAX_X, MaxExtent.MAX_Y],
      }),
      interactions: defaults({
        pinchRotate: false,
      }).extend([new PinchZoom({}), new MouseWheelZoom({ duration: 250 }), new KeyboardZoom({ duration: 1000 })]),
    });
    // verwijder de dubbelklikzoom interactie
    let dblClickInteraction = new DoubleClickZoom();
    map
      .getInteractions()
      .getArray()
      .forEach(interaction => {
        if (interaction instanceof DoubleClickZoom) {
          dblClickInteraction = interaction;
        }
      });
    map.removeInteraction(dblClickInteraction);
    this.setExtentToNL(map);

    map.on('singleclick', (evt: any) => {});
    map.on('moveend', event => {});
    return map;
  }
}
