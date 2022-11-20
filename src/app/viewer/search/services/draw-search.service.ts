import { Injectable } from '@angular/core';
import { DrawEvent } from 'ol/interaction/Draw';
import { bindCallback, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Drawing } from '~model/internal/drawing';
import { MapDrawToolService } from './map-draw-tool.service';
import { DisableMapClickService } from '~viewer/kaart/services/disable-map-click.service';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterName } from '~viewer/filter/types/filter-options';

@Injectable()
export class DrawSearchService {
  private drawEndSubject$ = new Subject<DrawEvent>();
  public drawEnd$ = this.drawEndSubject$.asObservable().pipe(
    tap(() => {
      this.inactivateDrawing();
    })
  );
  private drawing: Drawing;

  constructor(
    private mapDrawToolService: MapDrawToolService,
    private filterFacade: FilterFacade,
    private disableMapClickService: DisableMapClickService
  ) {}

  public removeFromMap(): void {
    this.filterFacade.resetFilters([FilterName.LOCATIE]);
    this.inactivateDrawing();
  }

  public enableMapClick(): void {
    this.disableMapClickService.close();
  }

  public draw(geometryType: string): void {
    this.drawing = this.mapDrawToolService.drawOnMap(geometryType);

    // see https://stackoverflow.com/questions/39524472/how-do-i-use-observable-bindcallback-with-typescript
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDrawing: any = bindCallback(this.drawing.draw.on.bind(this.drawing.draw));
    onDrawing('drawend').subscribe((result: DrawEvent) => {
      this.drawEndSubject$.next(result);
      this.disableMapClickService.enable();
    });
    this.disableMapClickService.disable();
  }

  public inactivateDrawing(): void {
    if (this.drawing != null && this.drawing.map != null) {
      this.drawing.map.removeInteraction(this.drawing.draw);
    }
  }
}
