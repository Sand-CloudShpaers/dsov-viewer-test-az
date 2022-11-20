import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import { LocationInfoNavigationService } from '~viewer/kaart/services/location-info-navigation.service';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { PortaalSessionGetService } from './portaal-session-get.service';
import { LocationInfoNavigationServiceMock } from '~viewer/kaart/services/location-info-navigation.service.mock';
import {
  sessionResponseActiviteitenNoData,
  sessionResponseActiviteitenNone,
  sessionResponseActiviteitenNoValue,
  sessionResponseActiviteitenSingle,
  sessionResponseLocatieAddress,
  sessionResponseLocatieCadastral,
  sessionResponseLocatieContour,
  sessionResponseLocatieCoordinate,
  sessionResponseLocatieNoSource,
} from '~mocks/session-response';
import { DataType, SessionType } from '~model/session/session';

describe('PortaalSessionGetService', () => {
  let spectator: SpectatorService<PortaalSessionGetService>;
  const spyOn_updateFilters = jasmine.createSpy('spyOn_updateFilters');

  const createService = createServiceFactory({
    service: PortaalSessionGetService,
    imports: [RouterTestingModule],
    providers: [
      { provide: LocationInfoNavigationService, useClass: LocationInfoNavigationServiceMock },
      mockProvider(FilterFacade, {
        updateFilters: spyOn_updateFilters,
      }),
    ],
  });

  describe('navigateWithSessionResponse', () => {
    beforeEach(() => {
      spectator = createService();
    });

    it('should search "adres" with response en geen activiteiten', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieAddress, sessionResponseActiviteitenNoData);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "adres" with response en geen activiteiten door ontbreken data', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieAddress, sessionResponseActiviteitenNone);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "adres" with response en geen activiteiten door lege value', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieAddress, sessionResponseActiviteitenNoValue);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "adres" with response en geen activiteiten door ontbreken response', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieAddress, undefined);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "adres" with response met activiteiten', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieAddress, sessionResponseActiviteitenSingle);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "perceel" with response met activiteiten', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieCadastral, sessionResponseActiviteitenSingle);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "coordinate" with response met activiteiten', () => {
      spectator.service.navigateWithSessionResponse(
        sessionResponseLocatieCoordinate,
        sessionResponseActiviteitenSingle
      );

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });

    it('should search "contour" with response met activiteiten', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieContour, sessionResponseActiviteitenSingle);

      expect(spyOn_updateFilters).toHaveBeenCalled();
    });
  });

  describe('navigateWithSessionResponse with no source', () => {
    beforeEach(() => {
      spectator = createService();
      spyOn_updateFilters.calls.reset();
    });

    it('should not search if data is ommited', () => {
      spectator.service.navigateWithSessionResponse(sessionResponseLocatieNoSource, sessionResponseActiviteitenSingle);

      expect(spyOn_updateFilters).not.toHaveBeenCalled();
    });
  });

  describe('sessionDataHandler', () => {
    beforeEach(() => {
      spectator = createService();
    });

    it('should set location response', () => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.start();
      spectator.service.setPort(messageChannel.port1);
      spectator.service.sessionDataHandler(sessionResponseLocatieAddress);

      expect(spectator.service.sessionResponseLocatie).toEqual(sessionResponseLocatieAddress);
    });

    it('should set activiteiten response', () => {
      spectator.service.sessionDataHandler(sessionResponseActiviteitenSingle);

      expect(spectator.service.sessionResponseActiviteiten).toEqual(sessionResponseActiviteitenSingle);
    });
  });

  describe('loadSessionLocation', () => {
    beforeEach(() => {
      spectator = createService();
    });

    it('should post message on port', () => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.start();
      spyOn(messageChannel.port1, 'postMessage').and.callThrough();
      spectator.service.setPort(messageChannel.port1);
      spectator.service.loadSessionLocation();
      // @ts-ignore
      expect(spectator.service.port.postMessage).toHaveBeenCalledWith({
        type: SessionType.REQ_GET_SESSION_DATA,
        dataType: DataType.LOCATIE,
      });
    });
  });
});
