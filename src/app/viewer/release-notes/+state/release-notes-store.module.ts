import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromReleaseNotes from '~store/common/index';
import { ReleaseNotesService } from '../services/release-notes.service';
import { ReleaseNotesEffects } from './release-notes.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(fromReleaseNotes.commonRootKey, fromReleaseNotes.reducers),
    EffectsModule.forFeature([ReleaseNotesEffects]),
  ],
  providers: [ReleaseNotesService],
})
export class ReleaseNotesStoreModule {}
