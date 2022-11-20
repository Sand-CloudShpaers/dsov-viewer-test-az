import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromFilteredResults from './index';
import { IhrPlannenService } from '../services/ihr-plannen.service';
import { OzonDocumentenService } from '../services/ozon-documenten.service';
import { IhrPlannenApiEffects } from '~viewer/filtered-results/+state/plannen/ihr-plannen-api.effects';
import { OzonRegelingenApiEffects } from '~viewer/filtered-results/+state/plannen/ozon-regelingen-api.effects';
import { PlannenEffects } from './plannen/plannen.effect';

@NgModule({
  imports: [
    StoreModule.forFeature(fromFilteredResults.filteredResultsFeatureRootKey, fromFilteredResults.reducers),
    EffectsModule.forFeature([PlannenEffects, IhrPlannenApiEffects, OzonRegelingenApiEffects]),
  ],
  providers: [IhrPlannenService, OzonDocumentenService],
})
export class FilteredResultsStoreModule {}
