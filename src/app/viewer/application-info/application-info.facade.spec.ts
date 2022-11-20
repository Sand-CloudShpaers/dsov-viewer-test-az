import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as ApplicationInfoActions from '~store/common/application-info/+state/application-info.actions';
import { ApplicationInfoFacade } from './application-info.facade';
import initialState from '~mocks/initial-state';

describe('ApplicationInfoFacade', () => {
  let facade: ApplicationInfoFacade;
  let store$: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApplicationInfoFacade, provideMockStore({ initialState })],
    });
    facade = TestBed.inject(ApplicationInfoFacade);
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  describe('getApplicationInfo', () => {
    it('should load dispatch load action', () => {
      facade.getApplicationInfo();

      expect(store$.dispatch).toHaveBeenCalledWith(ApplicationInfoActions.load());
    });
  });
});
