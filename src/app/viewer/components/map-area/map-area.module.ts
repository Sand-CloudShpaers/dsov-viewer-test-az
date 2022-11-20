import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MapFooterModule } from '../map-footer/map-footer.module';
import { MapPanelModule } from '../map-panel/map-panel.module';
import { VersionNumberModule } from '../version-number/version-number.module';
import { KaartModule } from '~viewer/kaart/kaart.module';
import { MeasureModule } from '~viewer/kaart/components/measure/measure.module';
import { MeasureService } from '~viewer/kaart/services/measure.service';
import { MapAreaComponent } from './map-area.component';
import { LegendModule } from '~viewer/kaart/components/legenda/legend.module';
import { LayerControlComponent } from '~viewer/components/map-area/layer-control/layer-control.component';
import { LayerSwitcherComponent } from '~viewer/components/map-area/layer-switcher/layer-switcher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MapFooterModule,
    MapPanelModule,
    MatSliderModule,
    VersionNumberModule,
    KaartModule,
    MeasureModule,
    LegendModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  declarations: [MapAreaComponent, LayerControlComponent, LayerSwitcherComponent],
  providers: [MeasureService],
  exports: [MapAreaComponent, LayerControlComponent, LayerSwitcherComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapAreaModule {}
