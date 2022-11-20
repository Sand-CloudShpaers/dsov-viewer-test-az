import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import * as fromState from './index';
import { RegelsOpMaatEffects } from './regels-op-maat.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromState.regelsOpMaatRootKey, fromState.reducers),
    EffectsModule.forFeature([RegelsOpMaatEffects]),
  ],
  providers: [OmgevingsDocumentService, IhrDocumentService],
})
export class RegelsOpMaatStoreModule {}
