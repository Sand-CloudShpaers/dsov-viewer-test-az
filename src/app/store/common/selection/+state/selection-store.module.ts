import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromSelection from '../../index';
import { EffectsModule } from '@ngrx/effects';
import { SelectionEffects } from './selection.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromSelection.commonRootKey, fromSelection.reducers),
    EffectsModule.forFeature([SelectionEffects]),
  ],
  providers: [],
})
export class SelectionStoreModule {}
