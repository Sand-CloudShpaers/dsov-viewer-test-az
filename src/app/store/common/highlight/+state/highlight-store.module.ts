import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromSelection from '../../index';
import { EffectsModule } from '@ngrx/effects';
import { HighlightEffects } from './highlight.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromSelection.commonRootKey, fromSelection.reducers),
    EffectsModule.forFeature([HighlightEffects]),
  ],
  providers: [],
})
export class HighlightStoreModule {}
