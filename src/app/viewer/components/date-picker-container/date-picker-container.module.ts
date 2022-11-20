import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DatePickerContainerComponent } from '~viewer/components/date-picker-container/date-picker-container.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DatePickerContainerComponent],
  exports: [DatePickerContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DatePickerContainerModule {}
