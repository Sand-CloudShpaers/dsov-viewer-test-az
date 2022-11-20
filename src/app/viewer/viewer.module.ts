import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DatePickerContainerModule } from '~viewer/components/date-picker-container/date-picker-container.module';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { HelpButtonModule } from '~viewer/components/help-button/help-button.module';
import { MessageModule } from '~viewer/components/message/message.module';
import { UsageMessageComponent } from '~viewer/components/usage-message/usage-message.component';
import { VersionNumberService } from '~viewer/components/version-number/version-number.service';
import { DisplayErrorsModule } from '~viewer/components/display-errors/display-errors.module';
import { MapAreaModule } from '~viewer/components/map-area/map-area.module';
import { OverzichtModule } from '~viewer/overzicht//overzicht.module';
import { DocumentenModule } from '~viewer/documenten/documenten.module';
import { CmsHttpClient } from '~http/cms.http-client';
import { IhrHttpClient } from '~http/ihr.http-client';
import { OzonHttpClient } from '~http/ozon.http-client';
import { LegendModule } from '~viewer/kaart/components/legenda/legend.module';
import { PipesModule } from '~general/pipes/pipes.module';
import { IhrProvider } from '~providers/ihr.provider';
import { OzonProvider } from '~providers/ozon.provider';
import { SearchModule } from '~viewer/search/search.module';
import { ConfigService } from '~services/config.service';
import { PdokService } from '~viewer/search/services/pdok-service';
import { PortaalSessionGetService } from '~portaal/portaal-session-get.service';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { SearchLocationService } from '~services/search-location.service';
import { OverlayModule } from '~viewer/overlay/overlay.module';
import { MeasureModule } from '~viewer/kaart/components/measure/measure.module';
import { RegelsOpMaatModule } from '~viewer/regels-op-maat/regels-op-maat.module';
import { ViewerComponent } from './viewer.component';
import { FilterModule } from './filter/filter.module';
import { GebiedsInfoModule } from '~viewer/gebieds-info/gebieds-info.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    DatePickerContainerModule,
    DocumentenModule,
    HelpButtonModule,
    RegelsOpMaatModule,
    OverlayModule,
    MapAreaModule,
    MessageModule,
    PipesModule,
    OverzichtModule,
    MeasureModule,
    LegendModule,
    SearchModule,
    RouterModule,
    DisplayErrorsModule,
    FilterModule,
    GebiedsInfoModule,
  ],
  bootstrap: [ViewerComponent],
  declarations: [ViewerComponent, UsageMessageComponent],
  providers: [
    SearchLocationService,
    PdokService,
    IhrProvider,
    IhrHttpClient,
    OzonProvider,
    OzonHttpClient,
    CmsHttpClient,
    NavigationFacade,
    ConfigService,
    VersionNumberService,
    PortaalSessionGetService,
    PortaalSessionPutService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewerModule {}
