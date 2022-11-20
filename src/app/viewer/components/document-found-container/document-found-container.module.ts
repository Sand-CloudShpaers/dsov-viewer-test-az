import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilteredResultsModule } from '~viewer/filtered-results/filtered-results.module';
import { DocumentFoundContainerComponent } from './document-found-container.component';

@NgModule({
  imports: [CommonModule, FilteredResultsModule],
  declarations: [DocumentFoundContainerComponent],
  exports: [DocumentFoundContainerComponent],
})
export class DocumentFoundContainerModule {}
