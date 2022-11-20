import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendComponent } from './legend.component';
import { LegendItemComponent } from './legend-item/legend-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SymbolenModule } from '~viewer/symbolen/symbolen.module';
import { LegendGroupComponent } from './legend-group/legend-group.component';

@NgModule({
  imports: [CommonModule, MatTooltipModule, SymbolenModule],
  declarations: [LegendComponent, LegendGroupComponent, LegendItemComponent],
  exports: [LegendComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LegendModule {}
