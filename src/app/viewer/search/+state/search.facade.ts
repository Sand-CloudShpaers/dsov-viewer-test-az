import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from '~viewer/regels-op-maat/+state';
import * as fromSearch from '~viewer/search/+state/search.selectors';
import { SearchStoreModule } from './search-store.module';
import * as SearchActions from './search.actions';
import { SearchMode } from '~viewer/search/types/search-mode';

@Injectable({
  providedIn: SearchStoreModule,
})
export class SearchFacade {
  public readonly searchMode$: Observable<SearchMode> = this.store.pipe(select(fromSearch.getSearchMode));

  constructor(private store: Store<State>) {}

  public setSearchMode(searchMode: SearchMode): void {
    this.store.dispatch(SearchActions.setSearchMode({ searchMode }));
  }
}
