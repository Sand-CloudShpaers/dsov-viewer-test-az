import { Injectable, Renderer2 } from '@angular/core';
import { formatNumber } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { Feature, MapBrowserEvent } from 'ol';
import Map from 'ol/Map';
import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';
import { Draw, Snap } from 'ol/interaction';
import { get, Projection } from 'ol/proj';
import { Geometry, LineString, Point, Polygon } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { StyleLike } from 'ol/style/Style';
import { Stroke, Style } from 'ol/style';
import { DrawEvent } from 'ol/interaction/Draw';
import { getArea, getLength } from 'ol/sphere';
import { MapPopup } from '~model/map-popup';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { KaartService, zIndices } from '~viewer/kaart/services/kaart.service';
import { GeoUtils } from '~general/utils/geo.utils';

const M_PER_KM = 1000;
const M2_PER_KM2 = 1000000;

@Injectable()
export class MeasureService {
  private createTooltipSubject$: Subject<MapPopup> = new Subject();
  public createTooltip$ = this.createTooltipSubject$.asObservable();
  private removeTooltipSubject$: Subject<boolean> = new Subject();
  public removeTooltip$ = this.removeTooltipSubject$.asObservable();
  public map: Map;
  public measureLayers: VectorLayer<VectorSource<Geometry>>[] = [];
  public measureSession: number;
  public draw: Draw[] = [];
  public units: string;
  public length: string;
  public area: string;
  public renderer: Renderer2;
  public mapPopupText: string;
  public rdNew: Projection;
  private activateStateSubject$ = new BehaviorSubject(false);
  public activateState$ = this.activateStateSubject$.asObservable();

  constructor(private kaartService: KaartService, private disableMapClickService: DisableMapClickService) {
    this.map = this.kaartService.getMap();
    this.units = this.getMeasureUnitMap();
    this.measureSession = 0;
    this.rdNew = get('EPSG:28992');
    this.mapPopupText = 'Plaats het eerste meetpunt';
  }

  private static getEndCoordinatesDrawing(event: DrawEvent): number[] {
    const coordinates = GeoUtils.getCoordinatesFromOlGeometry(event.feature.getGeometry());
    return coordinates[coordinates.length - 1] as number[];
  }

  private static formatMeasure(num: number, unit: string): string {
    let fractionDigits = 1;
    if (num == null) {
      num = 0;
    }
    if (num >= M_PER_KM && unit === 'm') {
      num = num / M_PER_KM;
      unit = 'km';
    }
    if (num >= M2_PER_KM2 && unit === 'm2') {
      num = num / M2_PER_KM2;
      unit = 'km2';
    }
    if (num > M_PER_KM) {
      fractionDigits = 0;
    }
    const digitsInfo = `2.0-${fractionDigits}`;

    return `${formatNumber(num, 'nl-NL', digitsInfo)} ${unit}`;
  }

  private static firstPointFeature(coordinates: number[]): VectorLayer<VectorSource<Geometry>> {
    const vector = new VectorLayer({
      source: new VectorSource(),
    });
    vector.getSource().addFeature(new Feature(new Point(coordinates)));
    return vector;
  }

  private static transformClosedLineToPolygon(geometry: Geometry): Polygon {
    return new Polygon([GeoUtils.getCoordinatesFromOlGeometry(geometry) as Coordinate[]]);
  }

  public measureActive(state: boolean): void {
    this.activateStateSubject$.next(state);
  }

  public deActivateMouseListener(): void {
    this.map.un('pointermove', this.onMouseMoveCallback);
  }

  public activateDraw(): void {
    this.map.getView().setMaxZoom(16);
    this.disableOtherMapInteractions();
    this.map.on('pointermove', this.onMouseMoveCallback);
    this.activateDrawSession(this.measureSession);
  }

  public disableOtherMapInteractions(): void {
    this.disableMapClickService.disable();
  }

  public deactivateDrawSession(meassureSession: number): void {
    this.map.removeInteraction(this.draw[meassureSession]);
  }

  public initDrawInteraction(session: number): Draw {
    return new Draw({
      source: this.measureLayers[session].getSource(),
      type: GeometryType.LINE_STRING,
      snapTolerance: 1,
      style: ((feature: Feature<Geometry>) => this.getStyleAndMeasure(feature)) as StyleLike,
    });
  }

  public drawStartInitialisations(session: number, coordinatesFirstPoint: number[]): void {
    this.snapToFirstPoint(coordinatesFirstPoint);
    this.mapPopupText = 'Plaats volgend meetpunt, dubbelklik om te stoppen';
  }

  public drawEndHandling(session: number, evt: DrawEvent): void {
    this.createStaticMeasurePopup(session, evt);
    this.mapPopupText = 'Plaats het eerste meetpunt';
    this.removeMovingMeasurePopup(session);
    this.length = null;
    this.area = null;
    this.map.addLayer(this.measureLayers[session]);
    this.deactivateDrawSession(session);
    this.measureSession++;
  }

  public activateDrawSession(measureSession: number): void {
    this.disableOtherMapInteractions();
    this.createMeasureLayer(measureSession);
    this.draw[measureSession] = this.initDrawInteraction(measureSession);
    this.map.addInteraction(this.draw[measureSession]);
    this.draw[measureSession].on('drawstart', (e: DrawEvent) => {
      this.drawStartInitialisations(measureSession, (e.feature.getGeometry() as LineString).getCoordinates()[0]);
    });
    this.draw[measureSession].on('drawend', (evt: DrawEvent) => {
      this.drawEndHandling(measureSession, evt);
      this.activateStateSubject$.next(false);
    });
    this.draw[measureSession].setActive(true);
  }

  public onMouseMoveCallback = (event: MapBrowserEvent<UIEvent>): void => {
    this.onMouseMove(event);
  };

  public onMouseMove(evt: MapBrowserEvent<UIEvent>): void {
    let mapPopup: MapPopup = {
      measureSession: this.measureSession,
      coordinate: evt.coordinate,
      text: this.mapPopupText,
      className: 'measure-tooltip',
    };
    this.createTooltipSubject$.next(mapPopup);
    if (this.length != null) {
      mapPopup = {
        measureSession: this.measureSession,
        coordinate: evt.coordinate,
        text: this.length,
        className: 'moving-measure-popup',
      };
      this.createTooltipSubject$.next(mapPopup);
    }
  }

  public deactivateDraw(): void {
    this.removeTooltipSubject$.next(true);
    this.draw.forEach(draw => this.map.removeInteraction(draw));
    this.deActivateMouseListener();
    this.map.getView().setMaxZoom(14);
    setTimeout(() => this.disableMapClickService.enable(), 1000);
  }

  public removeLayer(measureSession: number): void {
    this.measureLayers[measureSession].getSource().clear();
    this.map.removeLayer(this.measureLayers[measureSession]);
  }

  public removeMovingMeasurePopup(session: number): void {
    this.measureLayers[session].setStyle(
      new Style({
        stroke: new Stroke({
          color: [28, 28, 28, 1],
          width: 2,
          lineDash: [5, 5],
        }),
      })
    );
  }

  public snapToFirstPoint(coordinates: number[]): void {
    const snap = new Snap({
      pixelTolerance: 5,
      source: MeasureService.firstPointFeature(coordinates).getSource(),
    });
    this.map.addInteraction(snap);
  }

  private getMeasureUnitMap(): string {
    return this.map.getView().getProjection().getUnits();
  }

  private createMeasureLayer(layerNumber: number): void {
    this.measureLayers[layerNumber] = new VectorLayer({
      zIndex: zIndices.Meetlaag,
      source: new VectorSource(),
      style: ((feature: Feature<Geometry>) => this.getStyleAndMeasure(feature)) as StyleLike,
    });
  }

  private createStaticMeasurePopup(session: number, event: DrawEvent): void {
    if (this.length == null) {
      this.length = '0 m';
    }
    const staticMeasurePopup: MapPopup = {
      measureSession: session,
      textLength: `${this.length}`,
      textArea: `${this.area}`,
      className: 'static-measure-popup',
      coordinate: MeasureService.getEndCoordinatesDrawing(event),
    };
    this.createTooltipSubject$.next(staticMeasurePopup);
  }

  private getStyleAndMeasure(feature: Feature<Geometry>): Style[] {
    this.getLengthOrArea(feature);
    return [
      new Style({
        stroke: new Stroke({
          color: [28, 28, 28, 1],
          width: 2,
          lineDash: [5, 5],
        }),
      }),
    ];
  }

  private getLengthOrArea(feature: Feature<Geometry>): void {
    const geometry: Geometry = feature.getGeometry();
    const coordinates = GeoUtils.getCoordinatesFromOlGeometry(geometry) as Coordinate[];

    const isEnclosed =
      coordinates.length !== 2 &&
      coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
      coordinates[0][1] === coordinates[coordinates.length - 1][1];
    const isLine =
      (coordinates.length !== 2 && coordinates[0][0] !== coordinates[coordinates.length - 1][0]) ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1];

    if (isEnclosed) {
      this.mapPopupText = 'Dubbelklik om vlak te sluiten';
      const area = getArea(MeasureService.transformClosedLineToPolygon(geometry), {
        projection: this.rdNew,
        radius: 6371008.8,
      });
      this.area = MeasureService.formatMeasure(area, 'm2');
    } else if (isLine) {
      this.mapPopupText = 'Plaats volgend meetpunt, dubbelklik om te stoppen';
      const length = getLength(geometry, { projection: this.rdNew, radius: 6371008.8 });
      this.length = MeasureService.formatMeasure(length, 'm');
      this.area = null;
    }
  }
}
