import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ZoeklocatieEffects } from '~viewer/kaart/+state/zoeklocatie.effects';
import { ImroPlanlagenEffects } from '~viewer/kaart/+state/imro-planlagen.effects';

@NgModule({
  imports: [EffectsModule.forFeature([ZoeklocatieEffects, ImroPlanlagenEffects])],
})
export class KaartStoreModule {}
