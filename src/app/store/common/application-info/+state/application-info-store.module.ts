import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromCommon from '../../index';
import { EffectsModule } from '@ngrx/effects';
import { ApplicationInfoEffects } from './application-info.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromCommon.commonRootKey, fromCommon.reducers),
    EffectsModule.forFeature([ApplicationInfoEffects]),
  ],
  providers: [],
})
export class ApplicationInfoStoreModule {}
