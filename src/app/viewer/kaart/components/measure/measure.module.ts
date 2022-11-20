import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MeasureComponent } from './measure.component';
import { MeasureService } from '../../services/measure.service';

@NgModule({
  imports: [CommonModule],
  exports: [MeasureComponent],
  declarations: [MeasureComponent],
  providers: [MeasureService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeasureModule {}
