import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { Map, Overlay } from 'ol';
import { KaartService } from '../../services/kaart.service';
import { MeasureService } from '../../services/measure.service';
import { MapPopup } from '~model/map-popup';
import { PopupService } from '../../services/popup.service';
import { PopupDiv } from '~model/popup-div';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dsov-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnDestroy {
  public coordinate: number[];
  public movingMeasurePopup: PopupDiv;
  public movingMeasureTooltip: PopupDiv;
  public measurePopups: Overlay[] = [];
  public map: Map;
  private destroy$ = new Subject<void>();

  constructor(private kaartService: KaartService, private renderer: Renderer2, private measureService: MeasureService) {
    this.map = this.kaartService.getMap();
    this.createPopups();
    this.measureService.removeTooltip$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.removeMovingMeasureTooltip());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public createPopups(): void {
    this.measureService.createTooltip$
      .pipe(takeUntil(this.destroy$))
      .subscribe((mapPopup: MapPopup) => this.createPopup(mapPopup));
  }

  public createPopup(mapPopup: MapPopup): void {
    switch (mapPopup.className) {
      case 'static-measure-popup':
        this.removeMovingMeasurePopup();
        this.removeMovingMeasureTooltip();
        this.measurePopups[mapPopup.measureSession] = PopupService.createClickableMapPopup(
          this.map,
          mapPopup.coordinate,
          mapPopup.textLength,
          mapPopup.textArea,
          mapPopup.className,
          'static-measure-popup-closer',
          () => this.removeMeasureSession(mapPopup.measureSession),
          this.renderer
        );
        break;
      case 'moving-measure-popup':
        this.movingMeasurePopup = this.createMovingPopup(mapPopup, this.movingMeasurePopup);
        break;
      case 'measure-tooltip':
        this.movingMeasureTooltip = this.createMovingPopup(mapPopup, this.movingMeasureTooltip);
        break;
    }
  }

  public createMovingPopup(mapPopup: MapPopup, popupDiv: PopupDiv): PopupDiv {
    if (popupDiv != null) {
      PopupService.removeMapPopup(popupDiv, this.renderer);
    }
    return PopupService.createMapPopup(this.map, mapPopup.coordinate, mapPopup.text, mapPopup.className, this.renderer);
  }

  public removeMeasureSession(measureSession: number): void {
    this.removeMeasurePopup(measureSession);
    this.measureService.removeLayer(measureSession);
  }

  public removeMeasurePopup(measureSession: number): void {
    this.map.removeOverlay(this.measurePopups[measureSession]);
  }

  public removeMovingMeasurePopup(): void {
    if (this.movingMeasurePopup != null) {
      this.renderer.removeChild(this.movingMeasurePopup.div, this.movingMeasurePopup.text);
      this.renderer.removeClass(this.movingMeasurePopup.div, this.movingMeasurePopup.className);
    }
  }

  public removeMovingMeasureTooltip(): void {
    if (this.movingMeasureTooltip != null) {
      this.renderer.removeChild(this.movingMeasureTooltip.div, this.movingMeasureTooltip.text);
      this.renderer.removeClass(this.movingMeasureTooltip.div, this.movingMeasureTooltip.className);
    }
  }
}
