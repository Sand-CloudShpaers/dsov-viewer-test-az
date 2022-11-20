import { Injectable } from '@angular/core';
import { PortaalSessionGetService } from './portaal-session-get.service';
import { PortaalSessionPutService } from './portaal-session-put.service';
import { SessionType } from '~model/session/session';

@Injectable()
export class PortaalService {
  public port: MessagePort;

  constructor(
    private portaalSessionGetService: PortaalSessionGetService,
    private portaalSessionPutService: PortaalSessionPutService
  ) {}

  /** Vanuit de applicatie moet de MessageChannel worden opgezet
   * MessageChannel is een JavaScript communicatie protocol tussen parent en iframe
   */

  public initMessageChannel(): void {
    // Binnen het portaal afvangen dat de viewer geladen is
    window.addEventListener('message', event => this.messageHandler.call(this, event), false);

    const messageChannel = new MessageChannel();
    const message = {};
    const targetOrigin = '*';
    const transfer = messageChannel.port2;

    messageChannel.port1.addEventListener('message', event => this.portMessageHandler.call(this, event), false);
    messageChannel.port1.start();

    window.parent.postMessage(message, targetOrigin, [transfer]);
    this.port = messageChannel.port1;

    this.portaalSessionGetService.setPort(this.port);
    this.portaalSessionPutService.setPort(this.port);

    this.initSession();
    this.portaalSessionPutService.setRouterSubscription();
  }

  public messageHandler(messageEvent: MessageEvent): void {
    if (messageEvent.data === '[iFrameSizer]resize') {
      window.removeEventListener('message', event => this.messageHandler.call(this, event), false);
    }
  }

  public portMessageHandler(messageEvent: MessageEvent): void {
    const data = messageEvent.data;
    if (data?.type === SessionType.RES_GET_SESSION_DATA) {
      this.portaalSessionGetService.sessionDataHandler(data);
    }
  }

  public destroyMessageChannel(): void {
    window.removeEventListener('message', event => this.messageHandler.call(this, event), false);
    this.port.removeEventListener('message', event => this.portMessageHandler.call(this, event), false);
  }

  public inIframe = (): boolean => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  /** Een sessie wordt gevoed vanuit het portaal met locatie, werkzaamheden en activiteiten */
  private initSession(): void {
    /* Alleen als er geen sprake is van deeplinking een sessie ophalen */
    if (['/', '/zoeken'].includes(window.location.pathname)) {
      this.portaalSessionGetService.loadSessionLocation();
    }
  }
}
