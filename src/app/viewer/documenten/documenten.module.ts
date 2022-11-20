import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { LinkHandlerModule } from '~general/directives/link-handler/link-handler.module';
import { PipesModule } from '~general/pipes/pipes.module';
import { DocumentInhoudPageComponent } from './+pages/document-inhoud-page/document-inhoud-page.component';
import { DocumentKaartenPageComponent } from './+pages/document-kaarten-page/document-kaarten-page.component';
import { DocumentStructuurPageComponent } from './+pages/document-structuur-page/document-structuur-page.component';
import { DocumentenPageComponent } from './+pages/documenten-page/documenten-page.component';
import { DocumentToelichtingPageComponent } from './+pages/document-toelichting-page/document-toelichting-page.component';
import { DocumentObjectinformationPageComponent } from './+pages/document-objectinformatie-page/document-objectinformation-page.component';
import { DocumentBodyElementComponent } from './components/document-body-element/document-body-element.component';
import { DocumentBodyComponent } from './components/document-body/document-body.component';
import { DocumentElementTitleComponent } from './components/document-element-title/document-element-title.component';
import { DocumentStructuurContainerComponent } from './components/document-structuur-container/document-structuur-container.component';
import { DocumentHeaderComponent } from './components/document-header/document-header.component';
import { DocumentHeaderContainerComponent } from './components/document-header-container/document-header-container.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { TijdelijkDeelContainerComponent } from './components/tijdelijk-deel-container/tijdelijk-deel-container.component';
import { TijdelijkDeelComponent } from './components/tijdelijk-deel/tijdelijk-deel.component';
import { DocumentPageNavComponent } from '~viewer/documenten/components/document-page-nav/document-page-nav.component';
import { DocumentElementOptionsComponent } from './components/document-element-options/document-element-options.component';
import { AnnotatiesModule } from '~viewer/annotaties/annotaties.module';
import { SelectionModule } from '~store/common/selection/selection.module';
import { HoofdlijnContainerComponent } from './components/hoofdlijn-container/hoofdlijn-container.component';
import { ThemaComponent } from '~viewer/documenten/components/thema/thema.component';
import { StructuurElementenFiltersComponent } from './components/structuur-elementen-filters/structuur-elementen-filters.component';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { InhoudContainerComponent } from './components/inhoud-container/inhoud-container.component';
import { ZoomToPlanComponent } from './components/zoom-to-plan/zoom-to-plan.component';
import { DocumentElementBreadcrumbComponent } from './components/document-element-breadcrumb/document-element-breadcrumb.component';
import { DocumentBodyElementContentComponent } from '~viewer/documenten/components/document-body-element-content/document-body-element-content.component';
import { DocumentBodyElementTitleComponent } from './components/document-body-element-title/document-body-element-title.component';
import { BekendmakingenComponent } from './components/bekendmakingen/bekendmakingen.component';
import { KaartenModule } from '~viewer/kaarten/kaarten.module';
import { DocumentGerelateerdPageComponent } from '~viewer/documenten/+pages/document-gerelateerd-page/document-gerelateerd-page.component';
import { GerelateerdePlannenComponent } from './components/gerelateerde-plannen/gerelateerde-plannen.component';
import { GerelateerdePlannenContainerComponent } from './components/gerelateerde-plannen-container/gerelateerde-plannen-container.component';
import { KaartenContainerComponent } from './components/kaarten-container/kaarten-container.component';
import { KaartenImroComponent } from './components/kaarten-imro/kaarten-imro.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DocumentElementLinkComponent } from './components/document-element-link/document-element-link.component';
import { RouterModule } from '@angular/router';
import { KaartenOzonComponent } from './components/kaarten-ozon/kaarten-ozon.component';
import { IhrDisabledModule } from '~general/components/ihr-disabled/ihr-disabled.module';
import { IndexComponent } from './components/index/index.component';
import { IndexElementComponent } from './components/index-element/index-element.component';
import { InhoudOzonComponent } from './components/inhoud-ozon/inhoud-ozon.component';
import { InhoudIhrComponent } from './components/inhoud-ihr/inhoud-ihr.component';
import { HelpButtonModule } from '~viewer/components/help-button/help-button.module';
import { DocumentVersiesModule } from './components/document-versies/document-versies.module';
import { KaartenListItemImroComponent } from '~viewer/documenten/components/kaarten-list-imro/kaarten-list-item-imro/kaarten-list-item-imro.component';
import { IhrLocationDetailsComponent } from '~viewer/documenten/components/ihr-location-details/ihr-location-details.component';
import { KaartenListImroComponent } from '~viewer/documenten/components/kaarten-list-imro/kaarten-list-imro.component';
import { SymbolenModule } from '~viewer/symbolen/symbolen.module';

@NgModule({
  declarations: [
    BekendmakingenComponent,
    DocumentBodyComponent,
    DocumentBodyElementComponent,
    DocumentBodyElementTitleComponent,
    DocumentBodyElementContentComponent,
    DocumentElementBreadcrumbComponent,
    DocumentElementOptionsComponent,
    DocumentElementLinkComponent,
    DocumentElementTitleComponent,
    DocumentenPageComponent,
    DocumentGerelateerdPageComponent,
    DocumentHeaderComponent,
    DocumentHeaderContainerComponent,
    DocumentInhoudPageComponent,
    DocumentKaartenPageComponent,
    DocumentObjectinformationPageComponent,
    DocumentPageNavComponent,
    DocumentStructuurContainerComponent,
    DocumentStructuurPageComponent,
    DocumentToelichtingPageComponent,
    GerelateerdePlannenComponent,
    GerelateerdePlannenContainerComponent,
    HoofdlijnContainerComponent,
    IhrLocationDetailsComponent,
    IndexComponent,
    IndexElementComponent,
    InhoudContainerComponent,
    InhoudIhrComponent,
    InhoudOzonComponent,
    KaartenContainerComponent,
    KaartenImroComponent,
    KaartenListImroComponent,
    KaartenListItemImroComponent,
    KaartenOzonComponent,
    StructuurElementenFiltersComponent,
    ThemaComponent,
    TijdelijkDeelComponent,
    TijdelijkDeelContainerComponent,
    ToggleComponent,
    ZoomToPlanComponent,
  ],
  imports: [
    AnnotatiesModule,
    CommonModule,
    DocumentVersiesModule,
    HelpButtonModule,
    IhrDisabledModule,
    KaartenModule,
    LinkHandlerModule,
    MatSlideToggleModule,
    MatTabsModule,
    PipesModule,
    RouterModule,
    SelectionModule,
    SpinnerModule,
    SymbolenModule,
    SpinnerModule,
  ],
  exports: [
    DocumentBodyComponent,
    DocumentHeaderComponent,
    DocumentHeaderContainerComponent,
    ZoomToPlanComponent,
    InhoudContainerComponent,
    TijdelijkDeelContainerComponent,
    DocumentBodyElementComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentenModule {}
