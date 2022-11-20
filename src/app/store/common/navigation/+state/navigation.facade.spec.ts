import { TestBed } from '@angular/core/testing';
import { NavigationFacade } from './navigation.facade';
import { provideMockStore } from '@ngrx/store/testing';
import { commonRootKey, State } from '~store/common';
import { navigationFeatureKey } from './navigation.reducer';
import { Store } from '@ngrx/store';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import * as NavigationActions from './navigation.actions';

describe('NavigationFacade', () => {
  let navigationFacade: NavigationFacade;
  let store$: Store<State>;

  const initialState = {
    [commonRootKey]: {
      [navigationFeatureKey]: {
        ids: [],
        entities: {},
      },
    },
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        NavigationFacade,
        provideMockStore({
          initialState,
        }),
      ],
    });
    navigationFacade = TestBed.inject(NavigationFacade);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(navigationFacade).toBeTruthy();
  });

  it('set navigation path', () => {
    navigationFacade.setNavigationPath(ViewerPage.OVERZICHT, 'path/met/slashes');

    expect(store$.dispatch).toHaveBeenCalledWith(
      NavigationActions.setNavigationPath({
        page: ViewerPage.OVERZICHT,
        path: 'path/met/slashes',
      })
    );
  });
});
