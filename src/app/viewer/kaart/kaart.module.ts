import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KaartComponent } from './kaart.component';
import { KaartService } from './services/kaart.service';
import { MapClickModule } from './components/map-click/map-click.module';
import { PopupModule } from './components/popup/popup.module';
import { MeasureModule } from './components/measure/measure.module';
import { KaartdetailsButtonModule } from '~viewer/kaart/components/kaartdetails-button/kaartdetails-button.module';
import { MapboxStyleService } from '~viewer/kaart/services/helpers/mapbox-style.service';
import { ActiveLocationModule } from './components/active-location/active-location.module';

@NgModule({
  imports: [CommonModule, ActiveLocationModule, KaartdetailsButtonModule, MapClickModule, MeasureModule, PopupModule],
  declarations: [KaartComponent],
  exports: [KaartComponent],
})
export class KaartModule {
  public static forRoot(): ModuleWithProviders<KaartModule> {
    return {
      ngModule: KaartModule,
      providers: [KaartService, MapboxStyleService],
    };
  }
}
