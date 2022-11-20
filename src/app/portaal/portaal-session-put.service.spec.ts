import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Point, Polygon } from 'ol/geom';
import { LocationType } from '~model/internal/active-location-type.model';
import { DataType, REQ_PUT_SESSION_DATA, SessionType } from '~model/session/session';
import { PortaalSessionPutService } from './portaal-session-put.service';
import { Activiteit } from '~ozon-model/activiteit';
import { mockActiviteitFactory } from '~viewer/gebieds-info/types/test-gebieds-info.model';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { LocatieFilter } from '~viewer/filter/types/filter-options';

describe('PortaalSessionPutService', () => {
  let spectator: SpectatorService<PortaalSessionPutService>;

  const createService = createServiceFactory({
    service: PortaalSessionPutService,
    imports: [RouterTestingModule],
    providers: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('sendLocationToPortal', () => {
    it('should create', () => {
      expect(spectator.service).toBeTruthy();
    });

    it('should post adres location on port', () => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.start();
      spyOn(messageChannel.port1, 'postMessage').and.callThrough();
      spectator.service.setPort(messageChannel.port1);

      const locatieFilter: LocatieFilter = {
        id: 'adres',
        name: 'Adres',
        geometry: new Polygon([
          [
            [0, 0],
            [0, 100],
            [100, 100],
            [100, 0],
            [0, 0],
          ],
        ]),
        huisnummer: {
          label: '1',
          aanduidingId: '12345',
          olGeometry: null,
        },
        straat: 'Dorpstraat',
        postcode: '1000AA',
        source: LocationType.Adres,
        pdokId: 'pdokId',
      };

      spectator.service.sendLocationToPortal(locatieFilter);

      const message: REQ_PUT_SESSION_DATA = {
        type: SessionType.REQ_PUT_SESSION_DATA,
        dataType: DataType.LOCATIE,
        version: '1.0',
        data: {
          rd: {
            type: 'Polygon',
            coordinates: [
              [
                [0, 0],
                [0, 100],
                [100, 100],
                [100, 0],
                [0, 0],
              ],
            ],
          },
          label: locatieFilter.name,
          source: {
            address: {
              street: locatieFilter.straat,
              number: locatieFilter.huisnummer.label,
              numberindicationId: locatieFilter.huisnummer.aanduidingId,
              zipcode: locatieFilter.postcode,
              residence: locatieFilter.woonplaatsnaam,
              pdokId: locatieFilter.pdokId,
            },
          },
        },
      };

      // @ts-ignore
      expect(spectator.service.port.postMessage).toHaveBeenCalledWith(message);
    });

    it('should post coordinates location on port', () => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.start();
      spyOn(messageChannel.port1, 'postMessage').and.callThrough();
      spectator.service.setPort(messageChannel.port1);

      const activeLocation: LocatieFilter = {
        id: 'coordinatenRD',
        name: 'Coördinaten',
        geometry: new Point([10000, 10000]),
        coordinaten: {
          [ZoekLocatieSystem.RD]: [10000, 10000],
          system: ZoekLocatieSystem.RD,
        },
        source: LocationType.CoordinatenRD,
      };

      spectator.service.sendLocationToPortal(activeLocation);

      const message: REQ_PUT_SESSION_DATA = {
        type: SessionType.REQ_PUT_SESSION_DATA,
        dataType: DataType.LOCATIE,
        version: '1.0',
        data: {
          rd: {
            type: 'Point',
            coordinates: [10000, 10000],
          },
          label: activeLocation.name,
          source: {
            coordinate: {
              system: 'RD' as ZoekLocatieSystem,
              geometry: {
                type: 'Point',
                coordinates: [10000, 10000],
              },
            },
          },
        },
      };

      // @ts-ignore
      expect(spectator.service.port.postMessage).toHaveBeenCalledWith(message);
    });

    it('should post activitities on port', () => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.start();
      spyOn(messageChannel.port1, 'postMessage').and.callThrough();
      spectator.service.setPort(messageChannel.port1);

      const activities: Activiteit[] = [mockActiviteitFactory()];

      spectator.service.sendActivitiesToPortal(activities);

      const message: REQ_PUT_SESSION_DATA = {
        type: SessionType.REQ_PUT_SESSION_DATA,
        dataType: DataType.ACTIVITEITEN,
        version: '1.0',
        data: [
          {
            functionalStructureRef: '',
            urn: activities[0].identificatie,
            activityName: activities[0].naam,
            subActivities: [],
          },
        ],
      };

      // @ts-ignore
      expect(spectator.service.port.postMessage).toHaveBeenCalledWith(message);
    });
  });
});
