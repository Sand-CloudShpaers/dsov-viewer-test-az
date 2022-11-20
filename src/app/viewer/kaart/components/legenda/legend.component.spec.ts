import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { ApiSource } from '~model/internal/api-source';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { LegendComponent } from './legend.component';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { Selection, SelectionObjectType } from '~store/common/selection/selection.model';
import { LocationType } from '~model/internal/active-location-type.model';
import { LegendGroupVM } from './types/legend-group';

describe('LegendComponent', () => {
  let spectator: Spectator<LegendComponent>;

  const regeling: Selection = {
    id: 'id',
    name: 'regeling',
    objectType: SelectionObjectType.REGELINGSGEBIED,
    apiSource: ApiSource.OZON,
  };
  const aanduiding: Selection = {
    id: 'id',
    name: 'aanduiding',
    objectType: SelectionObjectType.BESTEMMINGSVLAK,
    apiSource: ApiSource.IHR,
  };
  const activiteit: Selection = {
    id: 'id',
    name: 'gebiedsaanwijzing',
    objectType: SelectionObjectType.GEBIEDSAANWIJZING,
    apiSource: ApiSource.OZON,
  };

  const legendGroups: LegendGroupVM[] = [
    {
      id: 'Regelingsgebied',
      name: 'Regelingsgebied',
      selections: [regeling],
    },
    {
      id: null,
      name: null,
      selections: [aanduiding],
    },
    {
      id: null,
      name: null,
      selections: [activiteit],
    },
    {
      id: null,
      name: null,
      selections: [aanduiding],
    },
    {
      id: null,
      name: null,
      selections: [activiteit],
    },
    {
      id: null,
      name: null,
      selections: [aanduiding],
    },
    {
      id: null,
      name: null,
      selections: [activiteit],
    },
  ];

  const createComponent = createComponentFactory({
    component: LegendComponent,
    providers: [mockProvider(FilterFacade), mockProvider(SelectionFacade)],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.locatieFilter$ = of({
      id: 'vlieland',
      name: 'Vlieland',
      geometry: null,
    });
    spectator.component.legend$ = of(legendGroups);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should render locatie', () => {
    spectator.detectComponentChanges();

    expect(spectator.query('[data-test-id="legend-item--locatie"]')).toExist();
  });

  it('should return subset of selections', () => {
    expect(spectator.component.getLegendGroups(legendGroups)).toHaveLength(6);
  });

  it('should return all selections', () => {
    spectator.component.toggle();

    expect(spectator.component.getLegendGroups(legendGroups)).toHaveLength(legendGroups.length);
  });

  it('should return "zoek-punt"', () => {
    expect(
      spectator.component.getLocatieSymboolcode({
        geometry: null,
        source: LocationType.CoordinatenETRS89,
        id: 'id',
        name: 'name',
      })
    ).toEqual('zoek-punt');
  });

  it('should return "zoek-gebied"', () => {
    expect(
      spectator.component.getLocatieSymboolcode({
        geometry: null,
        source: LocationType.Perceel,
        id: 'id',
        name: 'name',
      })
    ).toEqual('zoek-gebied');
  });
});
