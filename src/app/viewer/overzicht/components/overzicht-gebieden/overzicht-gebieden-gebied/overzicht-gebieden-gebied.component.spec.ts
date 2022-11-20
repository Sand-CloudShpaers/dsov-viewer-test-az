import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { OverzichtGebiedenGebiedComponent } from '~viewer/overzicht/components/overzicht-gebieden/overzicht-gebieden-gebied/overzicht-gebieden-gebied.component';

describe('OverzichtGebiedenGebiedComponent', () => {
  let spectator: Spectator<OverzichtGebiedenGebiedComponent>;

  const gebiedsAanwijzingMock: GebiedsaanwijzingVM = {
    naam: 'testNaam',
    identificatie: 'nl.imow-ws0650.gebied.130000200000060000000078e137050',
    groep: 'groep',
    type: 'Functie',
    isSelected: true,
  };

  const createComponent = createComponentFactory({
    component: OverzichtGebiedenGebiedComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({ props: { gebied: gebiedsAanwijzingMock } });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
