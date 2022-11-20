import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ActiviteitenEffects } from './activiteiten.effects';
import { ActiviteitenService } from '~viewer/overzicht/services/activiteiten.service';
import * as fromState from '~store/state';
import * as fromActiviteiten from './activiteiten.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(fromState.activiteitenKey, fromActiviteiten.reducer),
    EffectsModule.forFeature([ActiviteitenEffects]),
  ],
  providers: [ActiviteitenService],
})
export class ActiviteitenStoreModule {}
