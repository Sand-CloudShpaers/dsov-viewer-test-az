import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PipesModule } from '~general/pipes/pipes.module';
import { OverlayPanelComponent } from '~viewer/overlay/overlay-panel/overlay-panel.component';
import { ReleaseNotesModule } from '~viewer/release-notes/release-notes.module';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { HelpModule } from '~viewer/help/help.module';
import { HelpModalModule } from '~viewer/help/help-modal/help-modal.module';
import { LinkHandlerModule } from '~general/directives/link-handler/link-handler.module';
import { DocumentenModule } from '~viewer/documenten/documenten.module';
import { ApplicationInfoModule } from '~viewer/application-info/application-info.module';

@NgModule({
  imports: [
    CommonModule,
    HelpModule,
    LinkHandlerModule,
    ReleaseNotesModule,
    ApplicationInfoModule,
    PipesModule,
    SpinnerModule,
    DocumentenModule,
    HelpModalModule.forRoot(),
  ],
  declarations: [OverlayPanelComponent],
  exports: [OverlayPanelComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OverlayModule {}
