import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ActiviteitenModule } from '~viewer/activiteiten/activiteiten.module';
import { GebiedsaanwijzingenModule } from '~viewer/gebiedsaanwijzingen/gebiedsaanwijzingen.module';
import { GebiedsInfoComponent } from './gebieds-info.component';
import { CommonModule } from '@angular/common';
import { SelectionModule } from '~store/common/selection/selection.module';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NormenModule } from '~viewer/normen/normen.module';
import { CollapsibleListModule } from '~viewer/components/collapsible-list/collapsible-list.module';
import { FilterModule } from '~viewer/filter/filter.module';
import { FilteredResultsModule } from '~viewer/filtered-results/filtered-results.module';
import { DocumentFoundContainerModule } from '~viewer/components/document-found-container/document-found-container.module';

@NgModule({
  imports: [
    CommonModule,
    CollapsibleListModule,
    SelectionModule,
    SpinnerModule,
    MatTooltipModule,
    ActiviteitenModule,
    NormenModule,
    GebiedsaanwijzingenModule,
    FilterModule,
    FilteredResultsModule,
    DocumentFoundContainerModule,
  ],
  declarations: [GebiedsInfoComponent],
  exports: [GebiedsInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GebiedsInfoModule {}
