import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GebiedsaanwijzingenEffects } from './gebiedsaanwijzingen/gebiedsaanwijzingen.effects';
import { OmgevingsnormenEffects } from './omgevingsnormen/omgevingsnormen.effects';
import { OmgevingswaardenEffects } from './omgevingswaarden/omgevingswaarden.effects';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';
import * as fromGebiedsInfo from './index';

@NgModule({
  imports: [
    StoreModule.forFeature(fromGebiedsInfo.gebiedsinfoFeatureRootKey, fromGebiedsInfo.reducers),
    EffectsModule.forFeature([GebiedsaanwijzingenEffects, OmgevingsnormenEffects, OmgevingswaardenEffects]),
  ],
  providers: [GebiedsInfoService],
})
export class GebiedsInfoStoreModule {}
