import { KaartenImroComponent } from './kaarten-imro.component';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { kaartenImroConfigsMock } from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.selectors.spec';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImroPlanlagenService } from '~viewer/kaart/services/imro-planlagen.service';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';

describe('KaartenImroComponent', () => {
  let spectator: Spectator<KaartenImroComponent>;
  const spyOnApplyKaartStyle = jasmine.createSpy('spyOnApplyKaartStyle');
  const spyOnResetLagen = jasmine.createSpy('spyOnResetLagen');

  const createComponent = createComponentFactory({
    component: KaartenImroComponent,
    providers: [
      mockProvider(DocumentenFacade),
      mockProvider(ImroPlanlagenService, {
        applyKaartStyle: spyOnApplyKaartStyle,
        resetLagen: spyOnResetLagen,
      }),
      mockProvider(MapDetailsFacade),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  beforeEach(() => {
    spectator = createComponent({
      props: { documentId: 'NL.IMRO.plan-met-kaarten' },
    });
    spectator.component.imroKaartStyleConfigs$ = of(kaartenImroConfigsMock);
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should apply ImroKaartConfig onToggleSlider true', () => {
    spectator.component.onToggleSlider(kaartenImroConfigsMock, kaartenImroConfigsMock[1], true);

    expect(spectator.component.activeConfig).toEqual(1);
    expect(spyOnApplyKaartStyle).toHaveBeenCalledWith('NL.IMRO.plan-met-kaarten', kaartenImroConfigsMock[1]);
  });

  it('should reset lagen onToggleSlider false', () => {
    spectator.component.onToggleSlider(kaartenImroConfigsMock, kaartenImroConfigsMock[1], false);

    expect(spyOnResetLagen).toHaveBeenCalled();
  });

  it('should return "Plankaart" as title', () => {
    expect(spectator.component.getKaartTitle(kaartenImroConfigsMock[1])).toEqual('Plankaart');
  });

  it('trackByConfigId should return the id of the config', () => {
    expect(spectator.component.trackByConfigId(1, kaartenImroConfigsMock[1])).toBe('kaart2');
  });
});
