import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { DocumentVersiesComponent } from './document-versies.component';
import { DocumentVersiesItemComponent } from './document-versies-item/document-versies-item.component';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { PipesModule } from '~general/pipes/pipes.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DocumentVersiesComponent, DocumentVersiesItemComponent],
  imports: [CommonModule, RouterModule, PipesModule, SpinnerModule],
  exports: [DocumentVersiesComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentVersiesModule {}
