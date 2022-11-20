import { Injectable } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { ZoekLocatieCoordinates, ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import {
  Activiteit,
  DataType,
  REQ_GET_SESSION_DATA,
  RES_GET_SESSION_DATA,
  SessionLocatie,
  SessionType,
} from '~model/session/session';
import { ActiviteitVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { LocationType } from '~model/internal/active-location-type.model';

@Injectable()
export class PortaalSessionGetService {
  public sessionResponseLocatie: RES_GET_SESSION_DATA;
  public sessionResponseActiviteiten: RES_GET_SESSION_DATA;

  private port: MessagePort;

  constructor(private filterFacade: FilterFacade) {}

  public setPort(port: MessagePort): void {
    this.port = port;
  }

  public loadSessionLocation(): void {
    const message: REQ_GET_SESSION_DATA = {
      type: SessionType.REQ_GET_SESSION_DATA,
      dataType: DataType.LOCATIE,
    };
    this.port.postMessage(message);
  }

  public navigateWithSessionResponse(
    locatieResponse: RES_GET_SESSION_DATA,
    activiteitenResponse: RES_GET_SESSION_DATA
  ): void {
    const activiteiten: Activiteit[] = activiteitenResponse?.value?.data as Activiteit[];
    const sessionLocatie = locatieResponse?.value?.data as SessionLocatie;
    let path = ViewerPage.GEBIEDEN;

    if (activiteiten?.length) {
      const activiteitVMList: ActiviteitVM[] = activiteiten.map(activiteit => ({
        identificatie: activiteit.functionalStructureRef + '' + activiteit.activityName,
        naam: activiteit.activityName,
      }));
      this.filterFacade.openActiviteitFilter(activiteitVMList);
    } else {
      path = ViewerPage.OVERZICHT;
    }
    if (sessionLocatie) {
      this.navigateWithLocatie(sessionLocatie, path);
    }
  }

  /** Dit is de volgorde van sessie afhandelen:
   * 1. Locatie ophalen
   * 2. Activiteiten ophalen
   * 3. Navigeren met locatie en (evt) activiteiten
   *
   * NB. type 'any' omdat MessageEvent.data van type 'any' is
   */
  // eslint-disable-next-line
  public sessionDataHandler(data: any): void {
    if (data.value?.dataType === DataType.LOCATIE) {
      this.sessionResponseLocatie = data;
      this.loadSessionActiviteiten();
      return;
    }
    if (data.value?.dataType === DataType.ACTIVITEITEN) {
      this.sessionResponseActiviteiten = data;
    }

    if (this.sessionResponseLocatie) {
      this.navigateWithSessionResponse(this.sessionResponseLocatie, this.sessionResponseActiviteiten);
    }
  }

  private loadSessionActiviteiten(): void {
    const message: REQ_GET_SESSION_DATA = {
      type: SessionType.REQ_GET_SESSION_DATA,
      dataType: DataType.ACTIVITEITEN,
    };
    this.port.postMessage(message);
  }

  private navigateWithLocatie(sessionLocatie: SessionLocatie, page: ViewerPage): void {
    const path = [`${ApplicationPage.VIEWER}/${page}`];
    const source = sessionLocatie.source;
    if (source) {
      let locatieFilter: LocatieFilter = {
        geometry: null,
        id: null,
        name: null,
      };
      if (source.address || source.postalcode) {
        locatieFilter = {
          ...locatieFilter,
          name: sessionLocatie.label,
          id: source.address?.pdokId || source.postalcode?.pdokId,
          pdokId: source.address?.pdokId || source.postalcode?.pdokId,
          source: LocationType.Adres,
        };
      } else if (source.cadastral) {
        locatieFilter = {
          ...locatieFilter,
          name: sessionLocatie.label,
          id: source.cadastral.pdokId,
          pdokId: source.cadastral.pdokId,
          source: LocationType.Perceel,
        };
      } else if (source.coordinate) {
        const coordinaten: ZoekLocatieCoordinates = {
          [ZoekLocatieSystem.RD]: sessionLocatie.rd.coordinates as number[],
          system: ZoekLocatieSystem.RD,
        };
        locatieFilter = {
          ...locatieFilter,
          coordinaten,
          name: sessionLocatie.label,
          id: sessionLocatie.label,
          source:
            source.coordinate.system === ZoekLocatieSystem.RD
              ? LocationType.CoordinatenRD
              : LocationType.CoordinatenETRS89,
        };
      } else if (source.contour) {
        locatieFilter = {
          ...locatieFilter,
          name: sessionLocatie.label,
          id: sessionLocatie.label,
          geometry: new GeoJSON().readGeometry(sessionLocatie.rd),
          source: LocationType.Contour,
        };
      }
      this.filterFacade.updateFilters({ [FilterName.LOCATIE]: [locatieFilter] }, path);
    }
  }
}
