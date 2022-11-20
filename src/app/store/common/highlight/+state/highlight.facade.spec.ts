import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { commonRootKey } from '~store/common';
import { selectionFeatureKey } from '~store/common/selection/+state/selection.reducer';
import * as HighlightActions from './highlight.actions';
import { HighlightFacade } from './highlight.facade';
import { selectionMock } from '~store/common/selection/+state/selection-mock';

describe('HighlightFacade', () => {
  let service: HighlightFacade;
  let store$: Store<State>;

  const initialState = {
    [commonRootKey]: {
      [selectionFeatureKey]: {
        ids: ['a', 'b'],
        entities: {
          a: { id: 'a', data: { active: true } },
          b: { id: 'b', data: { active: false } },
        },
      },
    },
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HighlightFacade, provideMockStore({ initialState })],
    });
    service = TestBed.inject(HighlightFacade);
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  describe('startHighlight', () => {
    it('should dispatch load', () => {
      service.startHighlight({ id: selectionMock.id, apiSource: selectionMock.apiSource, selections: [selectionMock] });

      expect(store$.dispatch).toHaveBeenCalledWith(
        HighlightActions.load({ id: selectionMock.id, apiSource: selectionMock.apiSource, selections: [selectionMock] })
      );
    });
  });

  describe('cancelHighlight', () => {
    it('should dispatch cancel', () => {
      service.cancelHighlight();

      expect(store$.dispatch).toHaveBeenCalledWith(HighlightActions.cancel());
    });
  });
});
