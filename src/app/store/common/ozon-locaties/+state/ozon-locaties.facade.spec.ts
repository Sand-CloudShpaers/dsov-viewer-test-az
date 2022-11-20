import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { OzonLocatiesFacade } from '~store/common/ozon-locaties/+state/ozon-locaties.facade';
import { commonRootKey } from '~store/common';
import { ozonLocatiesRootKey } from '~store/common/ozon-locaties/+state/ozon-locaties.reducer';
import { LoadingState } from '~model/loading-state.enum';
import { Locatie } from '~ozon-model/locatie';

describe('OzonLocatiesFacade', () => {
  let ozonLocatiesFacade: OzonLocatiesFacade;
  let store$: Store<State>;

  const initialState = {
    [commonRootKey]: {
      [ozonLocatiesRootKey]: {
        locaties: [] as Locatie[],
        omgevingsplanPons: false,
        status: LoadingState.RESOLVED,
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OzonLocatiesFacade, provideMockStore({ initialState })],
    });
    ozonLocatiesFacade = TestBed.inject(OzonLocatiesFacade);
    store$ = TestBed.inject(Store);

    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(ozonLocatiesFacade).toBeTruthy();
  });
});
