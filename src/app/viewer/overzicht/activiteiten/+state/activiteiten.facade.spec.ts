import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { State } from '~store/common';
import { activiteitenKey } from '~store/state';
import { ActiviteitenFacade } from './activiteiten.facade';

describe('ActiviteitenFacade', () => {
  let activiteitenFacade: ActiviteitenFacade;
  let store$: Store<State>;

  const initialState = {
    [activiteitenKey]: {},
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActiviteitenFacade,
        provideMockStore({
          initialState,
        }),
      ],
    });
    activiteitenFacade = TestBed.inject(ActiviteitenFacade);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(activiteitenFacade).toBeTruthy();
  });
});
