import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DisplayErrorsComponent } from './display-errors.component';
import { ModalContentComponent } from './modal-content/modal-content.component';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [DisplayErrorsComponent, ModalContentComponent],
  exports: [DisplayErrorsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DisplayErrorsModule {}
