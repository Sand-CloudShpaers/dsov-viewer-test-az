import { fakeAsync, tick } from '@angular/core/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { FilterName } from '~viewer/filter/types/filter-options';
import * as fromFilterOptions from '~viewer/filter/+state/filter.reducer';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { FilterLabelComponent } from './filter-label.component';
import { of } from 'rxjs';
import { mockFilterOptions } from '~viewer/filter/+state/filter.mock';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { selectionMock } from '~store/common/selection/+state/selection-mock';
import { SelectionObjectType } from '~store/common/selection/selection.model';

describe('FilterLabelComponent', () => {
  let spectator: Spectator<FilterLabelComponent>;
  const spyOnRemoveFilter = jasmine.createSpy('spyOnRemoveFilter');

  const createComponent = createComponentFactory({
    component: FilterLabelComponent,
    providers: [mockProvider(FilterFacade, { removeFilter: spyOnRemoveFilter }), mockProvider(SelectionFacade)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.activeSelections$ = of([
      { ...selectionMock, id: 'nl.imow-mnre1034.gebiedsaanwijzing.RomeinseLimes', symboolcode: 'vag123' },
    ]);
    spectator.detectComponentChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('getFilterNames', () => {
    expect(spectator.component.getFilterNames()).toEqual([]);

    spectator.component.filterOptions = fromFilterOptions.initialState.filterOptions;

    const expected: FilterName[] = [
      FilterName.LOCATIE,
      FilterName.THEMA,
      FilterName.DOCUMENT_TYPE,
      FilterName.REGELGEVING_TYPE,
      FilterName.ACTIVITEIT,
      FilterName.REGELSBELEID,
      FilterName.GEBIEDEN,
      FilterName.DOCUMENTEN,
      FilterName.DATUM,
    ];

    // eslint-disable-next-line etc/no-assign-mutated-array
    expect(spectator.component.getFilterNames().sort()).toEqual(expected.sort());
  });

  it('removeFilter', fakeAsync(() => {
    const identification = { id: 'themaId', name: 'Testthema' };
    spectator.component.removeFilter(FilterName.THEMA, identification);

    tick(jasmine.DEFAULT_TIMEOUT_INTERVAL);

    expect(spyOnRemoveFilter).toHaveBeenCalledWith({ name: 'thema', filter: identification });
  }));

  it('add symbool', () => {
    spectator.component.filterOptions = {
      ...mockFilterOptions,
      [FilterName.GEBIEDEN]: [
        {
          id: 'nl.imow-mnre1034.gebiedsaanwijzing.RomeinseLimes',
          name: 'Romeinse Limes',
          group: 'gebiedsaanwijzing',
          objectType: SelectionObjectType.GEBIEDSAANWIJZING,
        },
      ],
    };
    spectator.detectComponentChanges();

    expect(spectator.queryAll('[data-test-id="dso-label-group__label__symbol"]').length).toEqual(1);
    expect(spectator.query('[data-symboolcode="vag123"]')).toExist();
  });
});
