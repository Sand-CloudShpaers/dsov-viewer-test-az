import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MapPanelComponent } from './map-panel.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [MapPanelComponent],
  exports: [MapPanelComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapPanelModule {}
