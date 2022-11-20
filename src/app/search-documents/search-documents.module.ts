import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '~general/pipes/pipes.module';
import { IhrDisabledModule } from '~general/components/ihr-disabled/ihr-disabled.module';
import { SearchDocumentsPageComponent } from './components/search-documents-page/search-documents-page.component';
import { SearchDocumentsSuggestComponent } from './components/search-documents-suggest/search-documents-suggest.component';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';

@NgModule({
  imports: [CommonModule, RouterModule, PipesModule, IhrDisabledModule, SpinnerModule],
  declarations: [SearchDocumentsPageComponent, SearchDocumentsSuggestComponent],
  exports: [SearchDocumentsPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SearchDocumentsModule {}
