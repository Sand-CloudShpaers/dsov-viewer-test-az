import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DocumentenApiEffects } from './documenten-api.effects';
import * as fromDocumenten from './index';
import { OmgevingsDocumentService } from '../services/omgevings-document.service';
import { RegeltekstEffects } from './regeltekst/regeltekst.effects';
import { DivisieannotatieEffects } from './divisieannotatie/divisieannotatie.effects';
import { HoofdlijnenEffects } from '~viewer/documenten/+state/hoofdlijnen/hoofdlijnen.effects';
import { DocumentElementLinkEffects } from '~viewer/documenten/+state/document-element-link/document-element-link.effects';
import { ThemasEffects } from '~viewer/documenten/+state/themas/themas.effects';
import { KaartenEffects } from '~viewer/documenten/+state/kaarten/kaarten.effects';
import { KaartenImroEffects } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.effects';
import { IhrDocumentService } from '../services/ihr-document.service';
import { IhrDocumentHtmlService } from '~viewer/documenten/services/ihr-document-html.service';
import { DocumentTekstenPlanobjectEffects } from '~viewer/documenten/+state/document-teksten-planobject/document-teksten-planobject-effects';
import { StructuurElementFilterEffects } from './structuurelement-filter/structuurelement-filter.effects';
import { DocumentLocatieEffects } from './document-locatie/document-locatie.effects';
import { MapDetailsEffects } from './map-details/map-details.effects';
import { DocumentVersiesEffects } from './document-versies/document-versies.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromDocumenten.documentFeatureRootKey, fromDocumenten.reducers),
    EffectsModule.forFeature([
      DivisieannotatieEffects,
      DocumentenApiEffects,
      HoofdlijnenEffects,
      KaartenEffects,
      KaartenImroEffects,
      RegeltekstEffects,
      ThemasEffects,
      DocumentElementLinkEffects,
      DocumentTekstenPlanobjectEffects,
      StructuurElementFilterEffects,
      DocumentLocatieEffects,
      MapDetailsEffects,
      DocumentVersiesEffects,
    ]),
  ],
  providers: [OmgevingsDocumentService, IhrDocumentService, IhrDocumentHtmlService],
})
export class DocumentenStoreModule {}
