import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { OverzichtGebiedenComponent } from './overzicht-gebieden.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { GebiedsInfoFacade } from '~viewer/gebieds-info/+state/gebieds-info.facade';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { GebiedenFilter } from '~viewer/filter/types/filter-options';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('OverzichtGebiedenComponent', () => {
  let spectator: Spectator<OverzichtGebiedenComponent>;
  const spyOnOpenGebiedenFilter = jasmine.createSpy('spyOnOpenGebiedenFilter');
  const spyOnAddSelections = jasmine.createSpy('spyOnAddSelections');
  const spyOnRemoveSelections = jasmine.createSpy('spyOnRemoveSelections');
  const gebiedsAanwijzingMock: GebiedsaanwijzingVM = {
    naam: 'testNaam',
    identificatie: 'nl.imow-ws0650.gebied.130000200000060000000078e137050',
    groep: 'groep',
    type: 'Functie',
    isSelected: true,
  };

  const createComponent = createComponentFactory({
    component: OverzichtGebiedenComponent,
    providers: [
      GebiedsInfoFacade,
      provideMockStore({ initialState }),
      mockProvider(SelectionFacade, {
        addSelections: spyOnAddSelections,
        removeSelections: spyOnRemoveSelections,
      }),
      mockProvider(FilterFacade, { openGebiedenFilter: spyOnOpenGebiedenFilter }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        overzichtGebieden: [gebiedsAanwijzingMock],
        gebiedsaanwijzingenStatus: {
          isLoading: false,
          isIdle: false,
          isPending: false,
          isResolved: true,
          isRejected: false,
          isLoaded: true,
        },
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should call openGebiedenFilter', () => {
    spectator.component.openGebiedenFilter(gebiedsAanwijzingMock);
    const gebiedenFilter: GebiedenFilter = {
      id: gebiedsAanwijzingMock.identificatie,
      name: gebiedsAanwijzingMock.naam,
      objectType: SelectionObjectType.GEBIEDSAANWIJZING,
    };

    expect(spyOnOpenGebiedenFilter).toHaveBeenCalledWith([gebiedenFilter]);
  });
});
