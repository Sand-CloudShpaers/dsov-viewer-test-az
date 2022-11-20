import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AnnotatiesApiEffects } from './annotaties-api.effects';
import * as fromAnnotaties from './index';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';

@NgModule({
  imports: [
    StoreModule.forFeature(fromAnnotaties.annotatiesFeatureRootKey, fromAnnotaties.reducers),
    EffectsModule.forFeature([AnnotatiesApiEffects]),
  ],
  providers: [OmgevingsDocumentService],
})
export class AnnotatiesStoreModule {}
