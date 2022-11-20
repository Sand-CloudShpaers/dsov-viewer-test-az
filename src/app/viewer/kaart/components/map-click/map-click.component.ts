import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Map from 'ol/Map';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { ShowHideConfig } from '~viewer/kaart/components/map-click/pipes/show-hide-config';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';

@Component({
  selector: 'dsov-map-click-overlay',
  templateUrl: './map-click.component.html',
  styleUrls: ['./map-click.component.scss'],
  animations: [ShowHideConfig.blowUp()],
})
export class MapClickComponent implements AfterViewInit, OnDestroy, OnInit {
  public coordinates: number[];
  public showOverlay = false;
  public infoLoaded = false;
  public map: Map;
  private destroy$ = new Subject<void>();

  constructor(
    private kaartService: KaartService,
    private disableMapClickService: DisableMapClickService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.map = this.kaartService.getMap();
  }

  public ngAfterViewInit(): void {
    /**
     * Add a click handler to the map to render the popup.
     */
    this.map.on('singleclick', evt => {
      // verhinder dat er op de kaart geclickt kan worden op de zoekpagina als er met datum wordt gezocht (tijdreizen)
      const enableSingleClick =
        !!this.route.snapshot.queryParams[TimeTravelQueryParams.DATE] ||
        this.route.snapshot.queryParams[TimeTravelQueryParams.DATE] !== '';
      if (enableSingleClick) {
        let popupEnabled: boolean;
        this.showOverlay = false;
        this.disableMapClickService.popupEnabled$.pipe(take(1), takeUntil(this.destroy$)).subscribe(enabled => {
          popupEnabled = enabled;
          if (!enabled) {
            this.closeOverlay();
            this.kaartService.removePin();
          }
        });

        this.coordinates = evt.coordinate;

        if (popupEnabled) {
          setTimeout(() => {
            this.showOverlay = true;
          }, 10);
          this.kaartService.addPin(this.coordinates);
        }
      }
    });

    this.disableMapClickService.close$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.closeOverlay();
    });
  }

  public closeOverlay(): void {
    this.showOverlay = false;
    this.kaartService.removePin();
  }

  public onSearch(): void {
    this.closeOverlay();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
