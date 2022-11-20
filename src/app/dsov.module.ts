import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DeployResponse } from '~config/deploy.conf';
import { DocumentenStoreModule } from '~viewer/documenten/+state/documenten-store.module';
import { FilteredResultsStoreModule } from '~viewer/filtered-results/+state/filtered-results-store.module';
import { AnnotatiesStoreModule } from '~viewer/annotaties/+state/annotaties-store.module';
import { metaReducers, reducerToken, runtimeChecks } from '~store/state';
import { ApplicationConfig } from '~config/config.conf';
import { environment } from '../environments/environment';
import { VersionNumberService } from '~viewer/components/version-number/version-number.service';
import { CustomErrorHandler } from './custom-error-handler';
import { DsovRoutingModule } from './dsov-routing.module';
import { DsovComponent } from './dsov.component';
import { CmsHttpClient } from '~http/cms.http-client';
import { IhrHttpClient } from '~http/ihr.http-client';
import { IhrHttpInterceptor } from '~http/ihr.http-interceptor';
import { OzonHttpClient } from '~http/ozon.http-client';
import { DeployProvider } from '~providers/deploy.provider';
import { IhrProvider } from '~providers/ihr.provider';
import { OzonProvider } from '~providers/ozon.provider';
import { ConfigService } from '~services/config.service';
import { ErrorHandlingService } from '~services/error-handling.service';
import { PdokService } from '~viewer/search/services/pdok-service';
import { PortaalSessionGetService } from '~portaal/portaal-session-get.service';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { SearchLocationService } from '~services/search-location.service';
import { FilterEffects } from '~viewer/filter/+state/filter.effects';
import { RegelsOpMaatStoreModule } from '~viewer/regels-op-maat/+state/regels-op-maat-store.module';
import { SelectionStoreModule } from '~store/common/selection/+state/selection-store.module';
import { KaartlaagFactoryService } from '~viewer/kaart/services/kaartlaag-factory.service';
import { KaartStoreModule } from '~viewer/kaart/+state/kaart-store.module';
import { GebiedsInfoStoreModule } from '~viewer/gebieds-info/+state/gebieds-info-store.module';
import { ReleaseNotesStoreModule } from '~viewer/release-notes/+state/release-notes-store.module';
import { OzonLocatiesStoreModule } from '~store/common/ozon-locaties/+state/ozon-locaties-store.module';
import { KaartModule } from '~viewer/kaart/kaart.module';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerModule } from '~viewer/viewer.module';
import { HomeModule } from '~home/home.module';
import { SearchModule } from '~viewer/search/search.module';
import { FilteredResultsModule } from '~viewer/filtered-results/filtered-results.module';
import { SearchStoreModule } from '~viewer/search/+state/search-store.module';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { WijzigingenModule } from './wijzigingen/wijzigingen/wijzigingen.module';
import { IhrDisabledModule } from '~general/components/ihr-disabled/ihr-disabled.module';
import { ActiviteitenStoreModule } from '~viewer/overzicht/activiteiten/+state/activiteiten-store.module';
import { ApplicationInfoStoreModule } from '~store/common/application-info/+state/application-info-store.module';
import { NavigationStoreModule } from '~store/common/navigation/+state/navigation-store.module';
import { ContentService } from '~services/content.service';
import { SearchDocumentsModule } from './search-documents/search-documents.module';
import { SearchDocumentsStoreModule } from '~search-documents/+state/search-documents-store.module';
import { LocatieFilterEffects } from '~viewer/filter/+state/locatie-filter.effects';
import { HighlightStoreModule } from '~store/common/highlight/+state/highlight-store.module';

/**
 * @TODO move to core module
 */
const storeFeatureModules = [
  OzonLocatiesStoreModule,
  SearchStoreModule,
  SearchDocumentsStoreModule,
  DocumentenStoreModule,
  FilteredResultsStoreModule,
  ReleaseNotesStoreModule,
  RegelsOpMaatStoreModule,
  ActiviteitenStoreModule,
  GebiedsInfoStoreModule,
  SelectionStoreModule,
  HighlightStoreModule,
  KaartStoreModule,
  AnnotatiesStoreModule,
  ApplicationInfoStoreModule,
  NavigationStoreModule,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    HttpClientJsonpModule,
    IhrDisabledModule,
    BrowserAnimationsModule,
    DsovRoutingModule,
    ViewerModule,
    WijzigingenModule,
    HomeModule,
    SearchDocumentsModule,
    SearchModule,
    FilteredResultsModule,
    StoreModule.forRoot(reducerToken, {
      metaReducers,
      runtimeChecks,
    }),
    EffectsModule.forRoot([FilterEffects, LocatieFilterEffects]),
    KaartModule.forRoot(),
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    ...storeFeatureModules,
  ],
  bootstrap: [DsovComponent],
  declarations: [DsovComponent],
  providers: [
    LocatieFilterService,
    SearchLocationService,
    PdokService,
    IhrProvider,
    IhrHttpClient,
    OzonProvider,
    OzonHttpClient,
    CmsHttpClient,
    NavigationFacade,
    { provide: HTTP_INTERCEPTORS, useClass: IhrHttpInterceptor, deps: [ConfigService], multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadVersion,
      deps: [VersionNumberService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadDeployParameters,
      deps: [DeployProvider],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (config: KaartlaagFactoryService) => (): Promise<boolean> => config.load(),
      deps: [KaartlaagFactoryService],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadContent,
      deps: [ContentService],
      multi: true,
    },
    ContentService,
    ConfigService,
    VersionNumberService,
    PortaalSessionGetService,
    PortaalSessionPutService,
    ErrorHandlingService,
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler,
    },
  ],
  exports: [],
})
export class DsovModule {}

function loadConfig(config: ConfigService): () => Promise<ApplicationConfig> {
  return (): Promise<ApplicationConfig> => config.load();
}

function loadVersion(versionNumberService: VersionNumberService): () => Promise<string> {
  return (): Promise<string> => versionNumberService.loadVersion();
}

function loadDeployParameters(deployProvider: DeployProvider): () => Promise<DeployResponse> {
  return (): Promise<DeployResponse> => deployProvider.loadDeployParameters();
}

function loadContent(contentService: ContentService): () => Promise<{ [key: string]: string }> {
  return (): Promise<{ [key: string]: string }> => contentService.load();
}
