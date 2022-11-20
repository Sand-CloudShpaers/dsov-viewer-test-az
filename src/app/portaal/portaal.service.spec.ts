import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { PortaalService } from './portaal.service';
import { KaartServiceMock } from '~viewer/kaart/services/kaart.service.mock';
import { PortaalSessionGetService } from './portaal-session-get.service';
import { sessionResponseLocatieAddress } from '~mocks/session-response';
import { PortaalSessionPutService } from './portaal-session-put.service';

describe('PortaalService', () => {
  let spectator: SpectatorService<PortaalService>;
  const spySessionDataHandler = jasmine.createSpy('spySessionDataHandler');

  const createService = createServiceFactory({
    service: PortaalService,
    imports: [RouterTestingModule],
    providers: [
      { provide: KaartService, useClass: KaartServiceMock },
      mockProvider(PortaalSessionGetService, {
        sessionDataHandler: spySessionDataHandler,
      }),
      PortaalSessionPutService,
    ],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should create', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should set location response', () => {
    const event: MessageEvent = new MessageEvent('message', {
      data: sessionResponseLocatieAddress,
    });
    spectator.service.portMessageHandler(event);

    expect(spySessionDataHandler).toHaveBeenCalledWith(event.data);
  });

  describe('inIframe', () => {
    it('should return true, when in iframe', () => {
      expect(spectator.service.inIframe()).toBeTrue();
    });
  });
});
