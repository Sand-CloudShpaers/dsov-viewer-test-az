import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReleaseNotesModule } from '~viewer/release-notes/release-notes.module';
import { WijzigingenComponent } from './wijzigingen.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [ReleaseNotesModule, RouterModule],
  declarations: [WijzigingenComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WijzigingenModule {}
