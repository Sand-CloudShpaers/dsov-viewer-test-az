import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { PdokService } from '~viewer/search/services/pdok-service';
import { SearchLocationService } from '~services/search-location.service';
import * as fromState from '~store/state';
import * as fromSearch from './search.reducer';

@NgModule({
  imports: [StoreModule.forFeature(fromState.searchKey, fromSearch.reducer)],
  providers: [PdokService, SearchLocationService],
})
export class SearchStoreModule {}
