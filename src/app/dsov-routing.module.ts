import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationPage, ViewerPage } from '~store/common/navigation/types/application-page';
import { HomeComponent } from '~home/home.component';
import { ViewerComponent } from '~viewer/viewer.component';
import { OverzichtComponent } from '~viewer/overzicht/overzicht.component';
import { ThemasPageComponent } from '~viewer/overzicht/themas/themas-page.component';
import { ActiviteitenPageComponent } from '~viewer/overzicht/activiteiten/activiteiten-page.component';
import { DocumentInhoudPageComponent } from '~viewer/documenten/+pages/document-inhoud-page/document-inhoud-page.component';
import { DocumentKaartenPageComponent } from '~viewer/documenten/+pages/document-kaarten-page/document-kaarten-page.component';
import { DocumentObjectinformationPageComponent } from '~viewer/documenten/+pages/document-objectinformatie-page/document-objectinformation-page.component';
import { DocumentStructuurPageComponent } from '~viewer/documenten/+pages/document-structuur-page/document-structuur-page.component';
import { DocumentenPageComponent } from '~viewer/documenten/+pages/documenten-page/documenten-page.component';
import { DocumentSubPages } from '~viewer/documenten/types/document-pages';
import { DocumentListContainerComponent } from '~viewer/filtered-results/components/document-list-container/document-list-container.component';
import { SearchResultsComponent } from '~viewer/filtered-results/components/search-results/search-results.component';
import { GebiedsInfoComponent } from '~viewer/gebieds-info/gebieds-info.component';
import { RegelsOpMaatPageComponent } from '~viewer/regels-op-maat/+pages/regels-op-maat-page/regels-op-maat-page.component';
import { SearchPageComponent } from '~viewer/search/search-page.component';
import { DocumentGerelateerdPageComponent } from '~viewer/documenten/+pages/document-gerelateerd-page/document-gerelateerd-page.component';
import { WijzigingenComponent } from './wijzigingen/wijzigingen/wijzigingen.component';
import { SearchDocumentsPageComponent } from '~search-documents/components/search-documents-page/search-documents-page.component';
import { DocumentSubpagesGuard } from './guards/document-subpages.guard';

const documentChildren: Routes = [
  {
    path: ':id',
    component: DocumentenPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        children: [],
        canActivate: [DocumentSubpagesGuard],
      },
      {
        path: DocumentSubPages.projectbesluit.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.beleid.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.regels.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.bijlagenBijRegels.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.besluitdocument.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.besluittekst.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.beleidstekst.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.deel.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.kaarten.path,
        component: DocumentKaartenPageComponent,
      },
      {
        path: DocumentSubPages.toelichting.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.bijlagenBijToelichting.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.bijlagen.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.bijlage.path,
        component: DocumentStructuurPageComponent,
      },
      {
        path: DocumentSubPages.inhoud.path,
        component: DocumentInhoudPageComponent,
      },
      {
        path: DocumentSubPages.overig.path,
        component: DocumentInhoudPageComponent,
      },
      {
        path: DocumentSubPages.kaartLocatieDetails.path,
        component: DocumentObjectinformationPageComponent,
      },
      {
        path: DocumentSubPages.gerelateerd.path,
        component: DocumentGerelateerdPageComponent,
      },
    ],
  },
];

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: ApplicationPage.HOME,
    redirectTo: '',
  },
  {
    path: ApplicationPage.WIJZIGINGEN,
    component: WijzigingenComponent,
  },
  {
    path: ApplicationPage.VIEWER,
    component: ViewerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SearchPageComponent,
      },
      {
        path: ViewerPage.OVERZICHT,
        component: OverzichtComponent,
      },
      {
        path: ViewerPage.THEMAS,
        component: ThemasPageComponent,
      },
      {
        path: ViewerPage.ACTIVITEITEN,
        component: ActiviteitenPageComponent,
      },
      {
        path: ViewerPage.DOCUMENTEN,
        component: SearchResultsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: DocumentListContainerComponent,
          },
        ],
      },
      {
        path: ViewerPage.GEBIEDEN,
        component: SearchResultsComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: GebiedsInfoComponent,
          },
        ],
      },
      {
        path: ViewerPage.DOCUMENT,
        children: documentChildren,
      },
      {
        path: ViewerPage.REGELSOPMAAT,
        component: RegelsOpMaatPageComponent,
      },
    ],
  },
  {
    path: ApplicationPage.ZOEK_DOCUMENTEN,
    component: SearchDocumentsPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class DsovRoutingModule {}
