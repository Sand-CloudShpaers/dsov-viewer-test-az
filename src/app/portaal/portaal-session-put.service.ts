import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Coordinate } from 'ol/coordinate';
import { LocationType } from '~model/internal/active-location-type.model';
import {
  DataType,
  REQ_PUT_SESSION_DATA,
  SessionMessageHistory,
  SessionSource,
  SessionType,
} from '~model/session/session';
import { GeoUtils, MAX_DECIMALS_RD } from '~general/utils/geo.utils';
import _default from 'ol/geom/GeometryType';
import GeoJSON, { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { ActiviteitVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { LocatieFilter } from '~viewer/filter/types/filter-options';
import POLYGON = _default.POLYGON;
import GEOMETRY_COLLECTION = _default.GEOMETRY_COLLECTION;

@Injectable()
export class PortaalSessionPutService {
  private port: MessagePort;
  // max verticelength RDNapTrans is 200m
  // 199m gebruiken ivm afrondingsverschillen
  private MAX_VERTICE_LENGTH = 199;

  constructor(private router: Router) {}

  public setPort(port: MessagePort): void {
    this.port = port;
  }

  /** Alle url wijzigingen worden naar het portaal gestuurd */
  public setRouterSubscription(): void {
    this.router.events
      .pipe(
        filter(routerEvent => routerEvent instanceof NavigationEnd),
        map(routerEvent => (routerEvent as NavigationEnd).url)
      )
      .subscribe(navigationEndUrl => {
        this.sendPathToPortal(navigationEndUrl);
      });
  }

  public sendActivitiesToPortal(activiteiten: ActiviteitVM[]): void {
    const message: REQ_PUT_SESSION_DATA = {
      type: SessionType.REQ_PUT_SESSION_DATA,
      dataType: DataType.ACTIVITEITEN,
      version: '1.0',
      data: activiteiten.map(activiteit => ({
        functionalStructureRef: '',
        urn: activiteit.identificatie,
        activityName: activiteit.naam,
        subActivities: [],
      })),
    };
    this.port.postMessage(message);
  }

  public sendLocationToPortal(activeLocation: LocatieFilter): void {
    let rd: GeoJSONGeometry;
    if ([POLYGON || GEOMETRY_COLLECTION].includes(activeLocation.geometry.getType())) {
      rd = new GeoJSON().writeGeometryObject(
        GeoUtils.addVerticesToGeometry(activeLocation.geometry, this.MAX_VERTICE_LENGTH)
      );
    } else {
      rd = new GeoJSON().writeGeometryObject(activeLocation.geometry, { decimals: MAX_DECIMALS_RD });
    }

    const message: REQ_PUT_SESSION_DATA = {
      type: SessionType.REQ_PUT_SESSION_DATA,
      dataType: DataType.LOCATIE,
      version: '1.0',
      data: {
        rd,
        label: activeLocation.name,
        source: this.getLocatieSource(activeLocation),
      },
    };
    this.port.postMessage(message);
  }

  private sendPathToPortal(path: string): void {
    const message: SessionMessageHistory = {
      type: SessionType.REQ_PUSH_HISTORY,
      value: path,
      timestamp: Date.now(),
    };
    this.port.postMessage(message);
  }

  private getLocatieSource(activeLocation: LocatieFilter): SessionSource {
    switch (activeLocation.source) {
      case LocationType.Adres:
        return {
          address: {
            street: activeLocation.straat,
            number: activeLocation.huisnummer.label,
            numberindicationId: activeLocation.huisnummer.aanduidingId,
            zipcode: activeLocation.postcode,
            residence: activeLocation.woonplaatsnaam,
            pdokId: activeLocation.pdokId,
          },
        };
      case LocationType.Perceel: {
        const parts = activeLocation.perceelcode?.split('-') || [];
        return {
          cadastral: {
            municipalityCode: parts[0],
            section: parts[1],
            lotnumber: parts[2],
            pdokId: activeLocation.pdokId,
          },
        };
      }
      case LocationType.CoordinatenRD:
      case LocationType.CoordinatenETRS89:
        return {
          coordinate: {
            system: activeLocation.coordinaten.system,
            geometry: {
              type: 'Point',
              coordinates: activeLocation.coordinaten[activeLocation.coordinaten.system],
            },
          },
        };
      case LocationType.Contour:
        return {
          contour: {
            system: 'RD',
            geometry: {
              type: 'Polygon',
              coordinates: GeoUtils.getCoordinatesFromOlGeometry(activeLocation.geometry) as Coordinate,
            },
          },
        };
      default:
        return null;
    }
  }
}
