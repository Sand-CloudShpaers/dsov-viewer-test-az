import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MeasureService } from '../../services/measure.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dsov-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss'],
})
export class MeasureComponent implements OnDestroy, AfterViewChecked {
  public font: string;

  public measureActive = false;

  private destroy$ = new Subject<void>();

  constructor(public measureService: MeasureService, private cdRef: ChangeDetectorRef) {
    this.measureService.activateState$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      if (state) {
        this.measureActive = true;
        this.measureService.activateDraw();
      } else {
        this.measureActive = false;
        this.measureService.deactivateDraw();
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.measureService.deactivateDraw();
  }

  public ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  public onToggleChange(): void {
    this.measureActive = !this.measureActive;
    this.emitMeasureActive();
  }

  public emitMeasureActive(): void {
    this.measureService.measureActive(this.measureActive);
  }
}
