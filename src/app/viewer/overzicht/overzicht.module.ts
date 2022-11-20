import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PipesModule } from '~general/pipes/pipes.module';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { FilterModule } from '~viewer/filter/filter.module';
import { OverzichtComponent } from './overzicht.component';
import { ThemasPageComponent } from './themas/themas-page.component';
import { ActiviteitenPageComponent } from './activiteiten/activiteiten-page.component';
import { ThemaTileComponent } from './components/thema-tile/thema-tile.component';
import { OverzichtThemaComponent } from './components/overzicht-thema/overzicht-thema.component';
import { SearchActiviteitComponent } from './components/search-activiteit/search-activiteit.component';
import { SearchModule } from '~viewer/search/search.module';
import { ActiviteitenModule } from '~viewer/activiteiten/activiteiten.module';
import { ActiviteitenService } from '~viewer/overzicht/services/activiteiten.service';
import { OverzichtActiviteitenComponent } from './components/overzicht-activiteiten/overzicht-activiteiten.component';
import { OverzichtGebiedenComponent } from './components/overzicht-gebieden/overzicht-gebieden.component';
import { ActiviteitenListComponent } from './activiteiten/components/activiteiten-list/activiteiten-list.component';
import { OverzichtGebiedenGebiedComponent } from '~viewer/overzicht/components/overzicht-gebieden/overzicht-gebieden-gebied/overzicht-gebieden-gebied.component';
import { SymbolenModule } from '~viewer/symbolen/symbolen.module';
import { DocumentFoundContainerModule } from '~viewer/components/document-found-container/document-found-container.module';
import { FilteredResultsModule } from '~viewer/filtered-results/filtered-results.module';
import { OverzichtGebiedenContainerComponent } from './components/overzicht-gebieden/overzicht-gebieden-container.component';
import { ActiviteitenListContainerComponent } from './activiteiten/components/activiteiten-list-container/activiteiten-list-container.component';
import { HelpButtonModule } from '~viewer/components/help-button/help-button.module';

@NgModule({
  imports: [
    CommonModule,
    FilterModule,
    MatTooltipModule,
    RouterModule,
    SpinnerModule,
    PipesModule,
    SearchModule,
    ActiviteitenModule,
    SymbolenModule,
    FilteredResultsModule,
    DocumentFoundContainerModule,
    HelpButtonModule,
  ],
  declarations: [
    OverzichtComponent,
    ThemaTileComponent,
    OverzichtThemaComponent,
    ThemasPageComponent,
    ActiviteitenListComponent,
    ActiviteitenListContainerComponent,
    ActiviteitenPageComponent,
    SearchActiviteitComponent,
    OverzichtActiviteitenComponent,
    OverzichtGebiedenContainerComponent,
    OverzichtGebiedenComponent,
    OverzichtGebiedenGebiedComponent,
  ],
  exports: [OverzichtComponent, ThemasPageComponent, ActiviteitenPageComponent],
  providers: [OzonLocatiesFacade, ActiviteitenService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OverzichtModule {}
