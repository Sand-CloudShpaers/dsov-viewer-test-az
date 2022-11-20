import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { PortaalService } from '~portaal/portaal.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { OverlayFacade } from '~viewer/overlay/+state/overlay.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';

@Component({
  selector: 'dsov-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  providers: [PortaalService],
})
export class ViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('viewerGridElement') public viewerGridElement: ElementRef;
  public showOverlay$ = this.overlayFacade.showOverlay$;
  public overlayVM$ = this.overlayFacade.overlayPanelVM$;
  public showPanel$ = this.filterFacade.getShowPanel$;

  constructor(
    private store: Store<State>,
    private portaalService: PortaalService,
    public kaartService: KaartService,
    private overlayFacade: OverlayFacade,
    private filterFacade: FilterFacade
  ) {}

  public ngOnInit(): void {
    if (this.portaalService.inIframe()) {
      /* Initieel in het portaal, de 150px zijn een 'schatting' van de hoogte van de header */
      const container = document.querySelector('.mainpage__main-container');
      container.setAttribute('style', `height: ${window.outerHeight - 150}px`);
      container.setAttribute('class', 'mainpage__main-container mainpage__main-container--iframe');
    }
  }

  public ngAfterViewInit(): void {
    this.viewerGridElement.nativeElement?.shadowRoot?.addEventListener('slotchange', () => {
      this.kaartService.updateSize();
    });
  }

  public closeOverlay(): void {
    this.overlayFacade.dispatchCloseOverlay();
  }

  public mainSizeChange(): void {
    this.kaartService.updateSize();
  }
}
