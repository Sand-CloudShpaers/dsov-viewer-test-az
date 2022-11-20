import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DsovComponent } from './dsov.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { DeployService } from '~services/deploy.service';
import { PortaalService } from '~portaal/portaal.service';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { PortaalSessionGetService } from '~portaal/portaal-session-get.service';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DsovComponent', () => {
  let spectator: Spectator<DsovComponent>;
  const spyOnFetchDispatchDeployParameters = jasmine.createSpy('spyOnFetchDispatchDeployParameters');

  const createComponent = createComponentFactory({
    component: DsovComponent,
    mocks: [],
    imports: [RouterTestingModule],
    providers: [
      provideMockStore({ initialState }),
      mockProvider(DeployService, {
        fetchDispatchDeployParameters: spyOnFetchDispatchDeployParameters,
      }),
      mockProvider(PortaalService),
      mockProvider(KaartService),
      mockProvider(PortaalSessionGetService),
      mockProvider(PortaalSessionPutService),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.inject(MockStore);
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeDefined();
  });

  it('should initialize', () => {
    spectator.component.ngOnInit();

    expect(spyOnFetchDispatchDeployParameters).toHaveBeenCalled();
  });
});
