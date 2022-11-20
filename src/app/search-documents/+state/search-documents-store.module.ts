import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SearchLocationService } from '~services/search-location.service';
import * as fromSearchDocuments from './search-documents.reducer';
import { SearchDocumentsEffects } from './search-documents.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromSearchDocuments.featureKey, fromSearchDocuments.reducer),
    EffectsModule.forFeature([SearchDocumentsEffects]),
  ],
  providers: [SearchLocationService],
})
export class SearchDocumentsStoreModule {}
