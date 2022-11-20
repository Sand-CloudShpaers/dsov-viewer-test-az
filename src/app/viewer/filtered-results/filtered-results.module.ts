import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { FilterModule } from '~viewer/filter/filter.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { RouterModule } from '@angular/router';
import { SearchModule } from '~viewer/search/search.module';
import { DocumentListContainerComponent } from './components/document-list-container/document-list-container.component';
import { DocumentListItemComponent } from './components/document-list-item/document-list-item.component';
import { DocumentListSectionComponent } from './components/document-list-section/document-list-section.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentFoundComponent } from './components/document-found/document-found.component';
import { HelpButtonModule } from '~viewer/components/help-button/help-button.module';

@NgModule({
  imports: [CommonModule, FilterModule, SpinnerModule, RouterModule, SearchModule, HelpButtonModule],
  declarations: [
    SearchResultsComponent,
    DocumentListContainerComponent,
    DocumentListItemComponent,
    DocumentListSectionComponent,
    DocumentListComponent,
    DocumentFoundComponent,
  ],
  exports: [SearchResultsComponent, DocumentFoundComponent],
  providers: [SelectionFacade],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilteredResultsModule {}
