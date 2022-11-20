import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { State } from '~store/state';
import initialState from '~mocks/initial-state';
import { closeOverlay, showHelp } from '~viewer/overlay/+state/overlay.actions';
import { HelpButtonComponent } from './help-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HelpButtonComponent', () => {
  let component: HelpButtonComponent;
  let fixture: ComponentFixture<HelpButtonComponent>;
  let store$: Store<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpButtonComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpButtonComponent);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showHelp', () => {
    it('should dispatch closeOverlay and showHelp', () => {
      component.showHelp();

      expect(store$.dispatch).toHaveBeenCalledWith(closeOverlay());
      expect(store$.dispatch).toHaveBeenCalledWith(showHelp());
    });
  });
});
