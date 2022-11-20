import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SearchFacade } from './search.facade';
import initialState from '~mocks/initial-state';
import * as SearchActions from './search.actions';
import { SearchMode } from '~viewer/search/types/search-mode';

describe('SearchFacade', () => {
  let searchFacade: SearchFacade;
  let store$: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchFacade, provideMockStore({ initialState })],
    });
    searchFacade = TestBed.inject(SearchFacade);
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(searchFacade).toBeTruthy();
  });

  it('setSearchMode', () => {
    searchFacade.setSearchMode(SearchMode.LOCATIE);

    expect(store$.dispatch).toHaveBeenCalledWith(SearchActions.setSearchMode({ searchMode: SearchMode.LOCATIE }));
  });
});
