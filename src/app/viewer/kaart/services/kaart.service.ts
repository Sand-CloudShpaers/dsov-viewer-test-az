import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Feature, Map, MapBrowserEvent, View } from 'ol';
import { Coordinate, format } from 'ol/coordinate';
import { defaults as defaultControls, MousePosition, ScaleLine } from 'ol/control';
import { Point } from 'ol/geom';
import { Extent } from 'ol/extent';
import { FeatureLike } from 'ol/Feature';
import { defaults, DoubleClickZoom, KeyboardZoom, MouseWheelZoom, PinchZoom } from 'ol/interaction';
import BaseLayer from 'ol/layer/Base';
import LayerGroup from 'ol/layer/Group';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { get } from 'ol/proj';
import { AchtergrondlagenService } from './achtergrondlagen.service';
import { InformatielagenService } from '~viewer/kaart/services/informatielagen.service';
import { ZoeklocatielaagService } from '~viewer/kaart/services/zoeklocatielaag.service';
import { OmgevingsdocumentlagenService } from './omgevingsdocumentlagen.service';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { ProjectieService } from '~viewer/kaart/services/projectie.service';
import { TilegridService } from '~viewer/kaart/services/tilegrid.service';
import { DisableMapClickService } from './disable-map-click.service';
import { MaxExtent } from '~general/utils/geo.utils';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { SearchLocationService } from '~services/search-location.service';
import { OlStylesConfig } from '~viewer/kaart/types/ol-styles.config';

export enum zIndices {
  HighlightLaag = 900,
  ZoekgebiedLaag = 1000,
  Meetlaag = 1001,
  CoordinateSearchPinLaag = 1002,
  MarkerLaag = 1003,
  ImroPlanLagen = 20,
  ImroGebiedsaanduidingen = 25,
  OmgevingsdocumentLagen = 30,
}

export const MOUSE_POSITION_SR_ONLY_LABEL = 'Coördinaten, door de positie van de muisaanwijzer, op de kaart ';
const MOUSE_POINTERMOVE_DELAY = 250;

@Injectable()
export class KaartService {
  public static center: [number, number] = [156527, 456220];
  public static nlxtent: Extent = [9632, 306708, 278200, 622130];
  private timeout: number;
  private map: Map;
  private achtergrondlagen: BaseLayer[];
  private informatielagen: BaseLayer[];
  private bestemmingsplanlagen: LayerGroup;
  private omgevingsdocumentLaag: BaseLayer;
  private omgevingsdocumentTijdreisLaag: BaseLayer;
  private zoekgebiedlaag: BaseLayer;
  private _featuresAtLocation: Subject<FeatureLike[]> = new ReplaySubject<FeatureLike[]>(1);
  private etrs89CoordinatesSubject$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null);
  public readonly etrs89Coordinates$: Observable<number[]> = this.etrs89CoordinatesSubject$.asObservable();

  constructor(
    private projectieService: ProjectieService,
    private tileGridService: TilegridService,
    private disableMapClickService: DisableMapClickService,
    private achtergondlagenService: AchtergrondlagenService,
    private informatielagenService: InformatielagenService,
    private omgevingsdocumentService: OmgevingsdocumentlagenService,
    private bestemmingsplanlagenService: ImroPlanlagenService,
    private zoeklocatielaagService: ZoeklocatielaagService,
    private searchLocationService: SearchLocationService,
    private router: Router
  ) {}

  public get featuresAtLocation(): Observable<FeatureLike[]> {
    return this._featuresAtLocation.asObservable();
  }

  public resetFeaturesAtLocation(): void {
    this.disableMapClickService.close();
    this._featuresAtLocation.next(undefined);
  }

  public setExtentToNL(map: Map): void {
    map.getView().fit(KaartService.nlxtent);
  }

  public getMap(): Map {
    return this.map;
  }

  /**
   * Observable function, omdat we zeker willen zijn dat de kaart geladen is, voordat de andere componenten daarmee verder kunnen.
   */
  public initMap$(): Observable<Map> {
    this.achtergrondlagen = this.achtergondlagenService.initializeAchtergrondlagen();
    this.informatielagen = this.informatielagenService.initializeInformatielagen();
    this.omgevingsdocumentLaag = this.omgevingsdocumentService.initDefault();
    this.omgevingsdocumentTijdreisLaag = this.omgevingsdocumentService.initTimeTravel();
    this.bestemmingsplanlagen = this.bestemmingsplanlagenService.lagen;
    this.zoekgebiedlaag = this.zoeklocatielaagService.initializeZoeklocatielaag();
    this.map = this.createNewMap();

    return of(this.map);
  }

  public updateSize(): void {
    this.map.updateSize();
  }

  public panToCoordinate(coordinate: Coordinate): void {
    this.map.getView().animate({ center: coordinate, duration: 200 });
  }

  public zoomToExtent(extent: Extent, timeout = 0, padding: number[] = [10, 10, 10, 10]): void {
    setTimeout(() => {
      this.map.getView().fit(extent, {
        padding,
        duration: 1000,
        // zoom naar zoomniveau 15 (10 m)
        minResolution: 0.105,
      });
    }, timeout);
  }

  public addPin(coordinate: number[]): void {
    this.removePin();
    this.map.addLayer(
      new VectorLayer({
        source: new VectorSource({ features: [new Feature(new Point(coordinate))] }),
        style: OlStylesConfig.PIN,
        zIndex: zIndices.CoordinateSearchPinLaag,
      })
    );
    this.panToCoordinate(coordinate);
  }

  public removePin(): void {
    this.map.getLayers().forEach(layer => {
      if (layer.getZIndex() === zIndices.CoordinateSearchPinLaag) {
        this.map.removeLayer(layer);
      }
    });
  }

  public toggleInteractions(toggle: boolean): void {
    this.map.getInteractions().forEach(i => i.setActive(toggle));
  }

  private createNewMap(): Map {
    // Stel een maximale extent in op de kaart zodat niet te ver kan worden uitgezoomd
    const map = new Map({
      view: new View({
        constrainResolution: true,
        extent: [MaxExtent.MIN_X, MaxExtent.MIN_Y, MaxExtent.MAX_X, MaxExtent.MAX_Y],
        projection: this.projectieService.getProjection(),
        resolutions: this.tileGridService.getResolutions(),
      }),
      interactions: defaults({
        pinchRotate: false,
      }).extend([new PinchZoom({}), new MouseWheelZoom({ duration: 250 }), new KeyboardZoom({ duration: 1000 })]),
      layers: this.achtergrondlagen.concat(this.informatielagen, [
        this.bestemmingsplanlagen,
        this.omgevingsdocumentLaag,
        this.omgevingsdocumentTijdreisLaag,
        this.zoekgebiedlaag,
      ]),
      controls: defaultControls({
        zoomOptions: {
          zoomInTipLabel: 'Zoom in',
          zoomOutTipLabel: 'Zoom uit',
        },
      }).extend([
        new ScaleLine({
          className: 'dso-map-scaleline',
        }),
        new MousePosition({
          undefinedHTML: '',
          projection: get('EPSG:28992'),
          className: 'dsov-mouse-position',

          coordinateFormat: (coordinate: Coordinate): string =>
            format(coordinate, `<span class="sr-only">${MOUSE_POSITION_SR_ONLY_LABEL}</span> {x}, {y}  (RD)`, 0),
        }),
      ]),
    });

    // verwijder de dubbelklikzoom interactie
    let doubleClickInteraction = new DoubleClickZoom();
    map
      .getInteractions()
      .getArray()
      .forEach(interaction => {
        if (interaction instanceof DoubleClickZoom) {
          doubleClickInteraction = interaction;
        }
      });
    map.removeInteraction(doubleClickInteraction);
    this.setExtentToNL(map);

    /**
     * SingleCLick op de kaart in /document/ context voor
     *  objectinfo, vooralsnog bij louter IMRO-plannnen, moet
     *  altijd navigeren naar locatiedetailstab als bestemmingsplanachtige
     */

    map.on('singleclick', clickEvent => {
      if (this.router.url.includes(`${ViewerPage.DOCUMENT}/NL.IMRO`)) {
        this._featuresAtLocation.next(this.getFeaturesAtLocation(clickEvent));
      }
    });
    map.on('moveend', event => {
      this.zoeklocatielaagService.plaatsZoekgebiedLabel(event.map.getView().calculateExtent(event.map.getSize()));
    });
    map.on('pointermove', event => {
      // Zorgt dat in kaart.component de etrs89-coördinaten niet getoond worden.
      this.etrs89CoordinatesSubject$.next(null);
      // Zolang de pointer in beweging is wordt de timeout gecleard
      if (this.timeout !== undefined) {
        window.clearTimeout(this.timeout);
      }
      // En weer opnieuwe gezet
      this.timeout = window.setTimeout(() => this.handlePointerMoveEnd(event), MOUSE_POINTERMOVE_DELAY);
    });

    return map;
  }

  private handlePointerMoveEnd(event: MapBrowserEvent<PointerEvent>): void {
    // Zodat na de delay de coördinaten uit het event vertaald kunnen worden en vervolgens middels de Subject
    // onder de kaart kunnen worden getoond
    this.searchLocationService
      .lookupRdNapTrans$(event.coordinate, ZoekLocatieSystem.RD)
      .subscribe(coords => this.etrs89CoordinatesSubject$.next(coords));
  }

  private getFeaturesAtLocation(clickEvent: MapBrowserEvent<UIEvent>): FeatureLike[] {
    const features = this.map.getFeaturesAtPixel(clickEvent.pixel, { hitTolerance: 2 });
    const result: FeatureLike[] = [];
    // In sommige gevallen bevatten de features dubbelingen, dat zijn features met identieke properties
    // Deze worden er uit gehaald, zodat in de lijst van details op locatie geen duplicaten getoond worden.
    features
      .filter(f => f.getProperties()['layer'] !== undefined)
      .forEach(feature => {
        if (!result.find(r => r.getProperties()['objectid'] === feature.getProperties()['objectid'])) {
          result.push(feature);
        }
      });
    return result;
  }
}
