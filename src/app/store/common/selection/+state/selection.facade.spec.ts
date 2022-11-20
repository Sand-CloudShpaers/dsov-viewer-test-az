import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { TestBed } from '@angular/core/testing';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import * as SelectionActions from './selection.actions';
import { selectionMock } from './selection-mock';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';

describe('SelectionFacade', () => {
  let selectionFacade: SelectionFacade;
  let store$: Store<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectionFacade, provideMockStore({ initialState })],
    });
    selectionFacade = TestBed.inject(SelectionFacade);
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  describe('addSelections', () => {
    it('should dispatch addSelections', () => {
      selectionFacade.addSelections([selectionMock]);

      expect(store$.dispatch).toHaveBeenCalledWith(SelectionActions.addSelections({ selections: [selectionMock] }));
    });
  });

  describe('showSelectionsOnMap', () => {
    it('should dispatch showSelectionsOnMap', () => {
      selectionFacade.showSelectionsOnMap();

      expect(store$.dispatch).toHaveBeenCalledWith(SelectionActions.showSelectionsOnMap());
    });
  });
});
