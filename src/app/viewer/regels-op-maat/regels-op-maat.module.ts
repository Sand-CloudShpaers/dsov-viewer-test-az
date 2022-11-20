import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '~general/pipes/pipes.module';
import { RegelsOpMaatPageComponent } from './+pages/regels-op-maat-page/regels-op-maat-page.component';
import { RegelsOpMaatContainerComponent } from './components/regels-op-maat-container/regels-op-maat-container.component';
import { DocumentenModule } from '~viewer/documenten/documenten.module';
import { FilterModule } from '~viewer/filter/filter.module';
import { RegelsOpMaatComponent } from './regels-op-maat.component';
import { LoadMoreComponent } from './components/load-more/load-more.component';
import { OmgevingsvergunningComponent } from './components/omgevingsvergunning/omgevingsvergunning.component';
import { RegelsOpMaatDocumentComponent } from './components/regels-op-maat-document/regels-op-maat-document.component';
import { RegelsOpMaatDocumentContainerComponent } from './components/regels-op-maat-document-container/regels-op-maat-document-container.component';
import { RegelsOpMaatDocumentHeaderComponent } from './components/regels-op-maat-document-header/regels-op-maat-document-header.component';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { HelpButtonModule } from '~viewer/components/help-button/help-button.module';

@NgModule({
  declarations: [
    RegelsOpMaatPageComponent,
    RegelsOpMaatContainerComponent,
    RegelsOpMaatComponent,
    RegelsOpMaatDocumentComponent,
    RegelsOpMaatDocumentContainerComponent,
    RegelsOpMaatDocumentHeaderComponent,
    LoadMoreComponent,
    OmgevingsvergunningComponent,
  ],
  imports: [CommonModule, DocumentenModule, FilterModule, HelpButtonModule, PipesModule, RouterModule, SpinnerModule],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegelsOpMaatModule {}
