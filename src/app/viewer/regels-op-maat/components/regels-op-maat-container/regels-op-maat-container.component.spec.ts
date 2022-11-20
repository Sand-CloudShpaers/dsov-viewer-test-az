import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RegelsOpMaatContainerComponent } from './regels-op-maat-container.component';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import initialState from '~mocks/initial-state';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RegelsOpMaatContainerComponent', () => {
  let spectator: Spectator<RegelsOpMaatContainerComponent>;
  const createComponent = createComponentFactory({
    component: RegelsOpMaatContainerComponent,
    providers: [provideMockStore({ initialState }), mockProvider(RegelsOpMaatFacade)],
    declarations: [MockComponent(RegelsOpMaatContainerComponent)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({});
    spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show dsov-regels-op-maat', () => {
    spectator.component.regelsOpMaatStatus$ = of({
      isResolved: true,
      isLoading: false,
      isIdle: false,
      isPending: false,
      isRejected: false,
      isLoaded: false,
    });
    spectator.component.documentIds$ = of(['id']);
    spectator.detectChanges();

    expect(spectator.queryAll('dsov-regels-op-maat')).toHaveLength(1);
  });
});
