import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromCommon from '~store/common';
import { OzonLocatiesEffects } from './ozon-locaties.effects';
import { OzonProvider } from '~providers/ozon.provider';

@NgModule({
  imports: [
    StoreModule.forFeature(fromCommon.commonRootKey, fromCommon.reducers),
    EffectsModule.forFeature([OzonLocatiesEffects]),
  ],
  providers: [OzonProvider],
})
export class OzonLocatiesStoreModule {}
