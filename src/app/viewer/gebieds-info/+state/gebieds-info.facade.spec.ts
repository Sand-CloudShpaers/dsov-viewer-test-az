import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { State } from '~store/common/index';
import { GebiedsInfoFacade } from '~viewer/gebieds-info/+state/gebieds-info.facade';

describe('GebiedsInfoFacade', () => {
  let gebiedsInfoFacade: GebiedsInfoFacade;
  let store$: Store<State>;

  const initialState = {
    gebiedsinfo: {},
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GebiedsInfoFacade,
        provideMockStore({
          initialState,
        }),
      ],
    });
    gebiedsInfoFacade = TestBed.inject(GebiedsInfoFacade);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(gebiedsInfoFacade).toBeTruthy();
  });
});
