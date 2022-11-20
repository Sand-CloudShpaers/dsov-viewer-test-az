import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import Geometry from 'ol/geom/Geometry';
import { ZoekLocatieInfo, ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { LocationQueryParams } from '~store/common/navigation/types/query-params';
import WKT from 'ol/format/WKT';
import { NavigationService } from '~store/common/navigation/services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class LocationInfoNavigationService {
  constructor(private navigationService: NavigationService) {}

  public getQueryParamsForCoordinates(locationInfo: ZoekLocatieInfo): Params {
    const x = locationInfo.coordinaten[locationInfo.coordinaten.system][0];
    const y = locationInfo.coordinaten[locationInfo.coordinaten.system][1];

    return {
      ...this.navigationService.getEmptyQueryParams(LocationQueryParams),
      [LocationQueryParams.LOCATIE_X]: `${
        locationInfo.coordinaten.system === ZoekLocatieSystem.RD ? Math.round(x) : x
      }`,
      [LocationQueryParams.LOCATIE_Y]: `${
        locationInfo.coordinaten.system === ZoekLocatieSystem.RD ? Math.round(y) : y
      }`,
      [LocationQueryParams.LOCATIE_STELSEL]: locationInfo.coordinaten.system,
      [LocationQueryParams.NO_ZOOM]: `${!!locationInfo.noZoom}`,
    };
  }

  public getQueryParamsForLocation(id: string): Params {
    return {
      ...this.navigationService.getEmptyQueryParams(LocationQueryParams),
      [LocationQueryParams.LOCATIE]: `${id}`,
    };
  }

  public getQueryParamsForContour(geometry: Geometry): Params {
    return {
      ...this.navigationService.getEmptyQueryParams(LocationQueryParams),
      [LocationQueryParams.LOCATIE_GETEKEND_GEBIED]: this.getGeometryString(geometry),
    };
  }

  private getGeometryString(geometry: Geometry): string {
    return new WKT().writeGeometry(geometry, {
      dataProjection: 'EPSG:28992',
    });
  }
}
