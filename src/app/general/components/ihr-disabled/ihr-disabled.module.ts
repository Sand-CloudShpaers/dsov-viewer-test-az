import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IhrDisabledComponent } from '~general/components/ihr-disabled/ihr-disabled.component';

@NgModule({
  declarations: [IhrDisabledComponent],
  exports: [IhrDisabledComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IhrDisabledModule {}
