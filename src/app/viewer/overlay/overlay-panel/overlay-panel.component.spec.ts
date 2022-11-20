import { RouterTestingModule } from '@angular/router/testing';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { OverlayPanelComponent } from '~viewer/overlay/overlay-panel/overlay-panel.component';
import { PipesModule } from '~general/pipes/pipes.module';
import { LoadingState } from '~model/loading-state.enum';
import { derivedLoadingState } from '~general/utils/store.utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LinkHandlerDirective } from '~general/directives/link-handler/link-handler.directive';
import { MockDirective } from 'ng-mocks';

describe('OverlayPanelComponent', () => {
  let spectator: SpectatorHost<OverlayPanelComponent>;
  const template = '<dsov-overlay-panel [overlayVM]="overlayVM" (clickedClosePanel)="null"></dsov-overlay-panel>';
  const overrides = {
    hostProps: {
      overlayVM: {
        show: true,
        content: 'inhoud',
        showApplicationInfo: false,
        showInterneLinkContainer: true,
        loadingStatus: derivedLoadingState(LoadingState.RESOLVED),
        title: 'titel',
        subtitle: 'subtitel',
        documentId: 'documentId',
      },
    },
  };

  const createHost = createHostFactory({
    component: OverlayPanelComponent,
    declarations: [MockDirective(LinkHandlerDirective)],
    imports: [RouterTestingModule, PipesModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  it('should show content', () => {
    const params = overrides;
    params.hostProps.overlayVM.content = 'aardige inhoud';
    params.hostProps.overlayVM.loadingStatus = derivedLoadingState(LoadingState.RESOLVED);
    params.hostProps.overlayVM.showInterneLinkContainer = true;
    spectator = createHost(template, params);

    expect(spectator.query('.overlay__content div').innerHTML).toEqual('aardige inhoud');
  });

  it('should show application info', () => {
    const params = overrides;
    params.hostProps.overlayVM.showApplicationInfo = true;
    params.hostProps.overlayVM.showInterneLinkContainer = false;
    spectator = createHost(template, params);

    expect(spectator.query('dsov-application-info')).toExist();
  });

  it('should show spinner', () => {
    overrides.hostProps.overlayVM.showApplicationInfo = false;
    overrides.hostProps.overlayVM.showInterneLinkContainer = true;
    overrides.hostProps.overlayVM.loadingStatus = derivedLoadingState(LoadingState.PENDING);
    spectator = createHost(template, overrides);

    expect(spectator.queryHost('dsov-spinner')).toExist();
  });
});
