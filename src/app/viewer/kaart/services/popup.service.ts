import { Injectable, Renderer2 } from '@angular/core';
import { Map, Overlay } from 'ol';
import { PopupDiv } from '~model/popup-div';

const POPUP_OFFSET = 10;

@Injectable()
export class PopupService {
  public static createMapPopup(
    map: Map,
    coordinate: number[],
    popupText: string,
    popupClassName: string,
    renderer: Renderer2
  ): PopupDiv {
    const div = renderer.createElement('div');
    const text = renderer.createText(popupText);
    renderer.addClass(div, popupClassName);
    renderer.appendChild(div, text);

    const popup = new Overlay({
      element: div,
      offset: [POPUP_OFFSET, POPUP_OFFSET],
    });
    popup.setPosition(coordinate);
    map.addOverlay(popup);
    return new PopupDiv(div, text, popupClassName);
  }

  public static removeMapPopup(popupDiv: PopupDiv, renderer: Renderer2): void {
    renderer.removeChild(popupDiv.div, popupDiv.text);
    renderer.removeClass(popupDiv.div, popupDiv.className);
  }

  public static createClickableMapPopup(
    map: Map,
    coordinate: number[],
    popupText: string,
    popupTextExtra: string,
    popupClassName: string,
    popupCloserClassName: string,
    closerFunction: (evt: Event) => void,
    renderer: Renderer2
  ): Overlay {
    const div = PopupService.createDiv(renderer, popupText, popupClassName, null);
    if (popupTextExtra != null && popupTextExtra !== 'null' && popupTextExtra !== 'undefined') {
      PopupService.createDiv(renderer, popupTextExtra, null, div);
    }
    PopupService.createMapPopupCloser(renderer, div, popupCloserClassName, closerFunction);
    return PopupService.setPopupOnMap(map, coordinate, div);
  }

  public static setPopupOnMap(map: Map, coordinate: number[], div: HTMLElement): Overlay {
    const popup = new Overlay({
      element: div,
      offset: [0, 0],
    });
    popup.setPosition(coordinate);
    map.addOverlay(popup);
    return popup;
  }

  private static createDiv(renderer: Renderer2, divtext: string, className: string, parent: HTMLElement): HTMLElement {
    const div = renderer.createElement('div');
    const text = renderer.createText(divtext);
    if (className != null) {
      renderer.addClass(div, className);
    }
    renderer.appendChild(div, text);
    if (parent != null) {
      renderer.appendChild(parent, div);
    }
    return div;
  }

  private static createMapPopupCloser(
    renderer: Renderer2,
    div: HTMLElement,
    popupCloserClass: string,
    closerFunction: (evt: Event) => void
  ): void {
    const a = renderer.createElement('a');
    renderer.addClass(a, popupCloserClass);
    renderer.listen(a, 'click', closerFunction);
    renderer.appendChild(div, a);
  }
}
