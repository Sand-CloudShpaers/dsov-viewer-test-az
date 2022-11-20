import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { KaartService, MOUSE_POSITION_SR_ONLY_LABEL } from './services/kaart.service';
import { MeasureService } from './services/measure.service';
import { Observable } from 'rxjs';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { Map } from 'ol';

@Component({
  selector: 'dsov-kaart',
  templateUrl: './kaart.component.html',
  styleUrls: ['./kaart.component.scss'],
})
export class KaartComponent implements AfterViewInit {
  @Input() map: Map;
  @Output() public showMapPanel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('mapElement') public mapElement: ElementRef;
  public measureActive$: Observable<boolean>;
  public activeZoekLocatieSystem$: Observable<ZoekLocatieSystem>;
  public etrs89Coordinates$ = this.kaartService.etrs89Coordinates$;
  public zoekLocatieSysteem = ZoekLocatieSystem;
  public mousePositionSrOnlyLabel = MOUSE_POSITION_SR_ONLY_LABEL;

  constructor(
    private kaartService: KaartService,
    private measureService: MeasureService,
    private filterFacade: FilterFacade
  ) {}

  public ngAfterViewInit(): void {
    this.measureActive$ = this.measureService.activateState$;
    this.activeZoekLocatieSystem$ = this.filterFacade.activeZoekLocatieSystem$;
    this.map.setTarget(this.mapElement.nativeElement.id);
    this.kaartService.setExtentToNL(this.map);
    this.addSrOnlyLabelToScaleline();
  }

  public onShowMapPanel(): void {
    this.showMapPanel.next();
  }

  private addSrOnlyLabelToScaleline(): void {
    /* De schaal van Open Layers heeft geen label om te zetten. Dit ten behoeve van WCAG */
    const dsoScaleline = document.querySelector('.dso-map-scaleline');
    if (dsoScaleline) {
      const label = document.createElement('div');
      label.setAttribute('class', 'sr-only');
      label.append('Schaal');
      dsoScaleline.prepend(label);
    }
  }
}
