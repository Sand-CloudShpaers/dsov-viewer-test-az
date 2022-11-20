import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveLocationComponent } from './active-location.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ActiveLocationComponent],
  exports: [ActiveLocationComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActiveLocationModule {}
