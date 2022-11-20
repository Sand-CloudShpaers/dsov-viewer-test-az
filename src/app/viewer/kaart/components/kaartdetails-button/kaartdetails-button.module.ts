import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KaartdetailsButtonComponent } from '~viewer/kaart/components/kaartdetails-button/kaartdetails-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [KaartdetailsButtonComponent],
  exports: [KaartdetailsButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class KaartdetailsButtonModule {}
