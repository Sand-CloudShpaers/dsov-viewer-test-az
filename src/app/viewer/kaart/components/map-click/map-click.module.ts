import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MapClickComponent } from '~viewer/kaart/components/map-click/map-click.component';
import { LocationInfoComponent } from '~viewer/kaart/components/map-click/location-info/location-info.component';
import { FloorPipe } from '~viewer/kaart/components/map-click/pipes/floor.pipe';
import { ShowHidePipe } from '~viewer/kaart/components/map-click/pipes/show-hide.pipe';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [CommonModule, HttpClientModule, SpinnerModule, MatTooltipModule],
  declarations: [MapClickComponent, LocationInfoComponent, FloorPipe, ShowHidePipe],
  exports: [MapClickComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MapClickModule {}
