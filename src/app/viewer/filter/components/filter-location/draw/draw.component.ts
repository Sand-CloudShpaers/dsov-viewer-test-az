import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import Geometry from 'ol/geom/Geometry';
import GeometryType from 'ol/geom/GeometryType';
import { DrawEvent } from 'ol/interaction/Draw';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawSearchService } from '~viewer/search/services/draw-search.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { GeoUtils } from '~general/utils/geo.utils';
import GeoJSON from 'ol/format/GeoJSON';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { LocationType } from '~model/internal/active-location-type.model';
import { FilterFacade } from '~viewer/filter/filter.facade';

const MIN_ZOOM_LEVEL = 10;

enum DrawState {
  INVALID_ZOOM = 'invalidZoom',
  DRAWING = 'drawing',
  FINISHED = 'finished',
  INVALID = 'invalid',
  OPENING = 'opening',
}

@Component({
  selector: 'dsov-search-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements OnInit, OnDestroy {
  @Input() public isTimeTravel = false;
  @Input() public showRequiredError = false;
  @Output() public changeContour = new EventEmitter<LocatieFilter>();

  public drawnGeometry: Geometry;
  public DrawState = DrawState;
  public currentDrawState: DrawState;

  private destroy$ = new Subject<void>();

  constructor(
    private drawSearchService: DrawSearchService,
    private kaartService: KaartService,
    private filterFacade: FilterFacade
  ) {}

  public ngOnInit(): void {
    this.watchEndDrawing();
    this.checkZoomLevel();
    this.kaartService.getMap()?.on('moveend', this.checkZoomLevel);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.kaartService.getMap()?.un('moveend', this.checkZoomLevel);
    this.currentDrawState = null;
    this.drawnGeometry = null;
  }

  public handleOpen(): void {
    const geometry = new GeoJSON().readGeometry(new GeoJSON().writeGeometryObject(this.drawnGeometry, { decimals: 3 }));
    this.changeContour.emit({
      id: 'getekend_gebied',
      name: 'Getekend gebied',
      geometry,
      source: LocationType.Contour,
    });
  }

  public handleRestart = (): void => {
    this.kaartService.getMap()?.getView()?.setZoom(MIN_ZOOM_LEVEL);
    this.drawSearchService.removeFromMap();
    this.startDrawing();
  };

  private checkZoomLevel = (): void => {
    if (this.currentDrawState === DrawState.INVALID) {
      return;
    }
    const zoomLevel = this.kaartService.getMap()?.getView()?.getZoom();
    if (zoomLevel >= MIN_ZOOM_LEVEL) {
      if (this.drawnGeometry) {
        this.currentDrawState = DrawState.FINISHED;
      } else {
        if (this.currentDrawState !== DrawState.DRAWING) {
          this.startDrawing();
        }
      }
    } else {
      if (this.currentDrawState === DrawState.DRAWING) {
        // Workaround for bug where OL minZoom cannot be set
        this.kaartService.getMap()?.getView()?.setZoom(MIN_ZOOM_LEVEL);
      } else {
        this.currentDrawState = DrawState.INVALID_ZOOM;
      }
    }
  };

  private startDrawing(): void {
    this.currentDrawState = DrawState.DRAWING;
    this.drawnGeometry = null;
    this.drawSearchService.draw(GeometryType.POLYGON);
  }

  private watchEndDrawing(): void {
    this.drawSearchService.drawEnd$.pipe(takeUntil(this.destroy$)).subscribe((evt: DrawEvent) => {
      const geometry = evt.feature.getGeometry();
      this.filterFacade.previewFilters({
        [FilterName.LOCATIE]: [
          {
            id: 'getekend_gebied',
            name: 'Getekend gebied',
            geometry,
            contour: geometry,
            source: LocationType.Contour,
          },
        ],
      });
      if (GeoUtils.isValid(geometry)) {
        this.currentDrawState = DrawState.FINISHED;
        this.drawnGeometry = geometry;
      } else {
        this.currentDrawState = DrawState.INVALID;
      }
    });
  }
}
