import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReleaseNotesComponent } from '~viewer/release-notes/release-notes.component';
import { PipesModule } from '~general/pipes/pipes.module';

@NgModule({
  declarations: [ReleaseNotesComponent],
  exports: [ReleaseNotesComponent],
  imports: [CommonModule, PipesModule],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReleaseNotesModule {}
