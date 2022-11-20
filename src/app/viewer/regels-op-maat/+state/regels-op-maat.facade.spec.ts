import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RegelsOpMaatFacade } from './regels-op-maat.facade';
import { State } from '~viewer/documenten/+state';
import * as RegelsOpMaatActions from '~viewer/regels-op-maat/+state/regels-op-maat/regels-op-maat.actions';
import { Router } from '@angular/router';
import { NavigationFacade } from '~store/common/navigation/+state/navigation.facade';
import { mockProvider } from '@ngneat/spectator';

describe('RegelsOpMaatFacade', () => {
  let regelsOpMaatFacade: RegelsOpMaatFacade;
  let store$: Store<State>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const spyOnSetNavigationPath = jasmine.createSpy('spyOnSetNavigationPath');

  const initialState = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RegelsOpMaatFacade,
        mockProvider(NavigationFacade, {
          setNavigationPath: spyOnSetNavigationPath,
        }),
        provideMockStore({
          initialState,
        }),
        { provide: Router, useValue: routerSpy },
      ],
    });
    regelsOpMaatFacade = TestBed.inject(RegelsOpMaatFacade);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(regelsOpMaatFacade).toBeTruthy();
  });

  it('should open regels op maat', () => {
    regelsOpMaatFacade.loadRegelsOpMaat();

    expect(store$.dispatch).toHaveBeenCalledWith(RegelsOpMaatActions.resetRegelsOpMaat());
    expect(store$.dispatch).toHaveBeenCalledWith(RegelsOpMaatActions.loadRegelsOpMaat());
  });
});
