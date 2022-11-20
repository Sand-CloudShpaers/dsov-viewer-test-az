import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActiviteitenModule } from '~viewer/activiteiten/activiteiten.module';
import { GebiedsaanwijzingenModule } from '~viewer/gebiedsaanwijzingen/gebiedsaanwijzingen.module';
import { SelectionModule } from '~store/common/selection/selection.module';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { NormenModule } from '~viewer/normen/normen.module';
import { LocatiesComponent } from './components/locaties/locaties.component';
import { BestemmingsplanFeaturesComponent } from './components/bestemmingsplan-features/bestemmingsplan-features.component';
import { HoofdlijnenComponent } from './components/hoofdlijnen/hoofdlijnen.component';
import { CollapsibleListModule } from '~viewer/components/collapsible-list/collapsible-list.module';
import { KaartenModule } from '~viewer/kaarten/kaarten.module';
import { SelectableListModule } from '~viewer/components/selectable-list/selectable-list.module';
import { AnnotatiesComponent } from './components/annotaties/annotaties.component';
import { AnnotatiesContainerComponent } from './components/annotaties-container/annotaties-container.component';
import { AnnotatiesSelectiesComponent } from './components/annotaties-selecties/annotaties-selecties.component';

@NgModule({
  imports: [
    CommonModule,
    SelectionModule,
    SpinnerModule,
    ActiviteitenModule,
    NormenModule,
    GebiedsaanwijzingenModule,
    CollapsibleListModule,
    SelectableListModule,
    KaartenModule,
    RouterModule,
  ],
  declarations: [
    AnnotatiesContainerComponent,
    AnnotatiesComponent,
    LocatiesComponent,
    HoofdlijnenComponent,
    BestemmingsplanFeaturesComponent,
    AnnotatiesSelectiesComponent,
  ],
  exports: [AnnotatiesContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AnnotatiesModule {}
