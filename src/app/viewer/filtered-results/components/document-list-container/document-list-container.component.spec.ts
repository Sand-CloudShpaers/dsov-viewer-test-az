import { createHostFactory, mockProvider, SpectatorHost } from '@ngneat/spectator';
import { of } from 'rxjs';
import { FilteredResultsFacade } from '../../+state/filtered-results.facade';
import { DocumentListContainerComponent } from './document-list-container.component';
import { SelectionFacade } from '~store/common/selection/+state/selection.facade';
import { Router } from '@angular/router';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { RegelsOpMaatFacade } from '~viewer/regels-op-maat/+state/regels-op-maat.facade';
import { FilterName } from '~viewer/filter/types/filter-options';

describe('DocumentListContainerComponent', () => {
  let spectator: SpectatorHost<DocumentListContainerComponent>;

  const spyOnResetFilters = jasmine.createSpy('spyOnResetFilters');
  const spyOnShowSelectionsOnMap = jasmine.createSpy('spyOnShowSelectionsOnMap');

  const createHost = createHostFactory({
    component: DocumentListContainerComponent,
    providers: [
      {
        provide: FilteredResultsFacade,
        useValue: {
          getIsDirty$: of(false),
        },
      },
      mockProvider(SelectionFacade, {
        showSelectionsOnMap: spyOnShowSelectionsOnMap,
      }),
      mockProvider(FilterFacade, {
        resetFilters: spyOnResetFilters,
      }),
      mockProvider(RegelsOpMaatFacade),
      mockProvider(Router),
    ],
  });

  beforeEach(() => {
    spectator = createHost(
      `<dsov-document-list-container
      ></dsov-document-list-container>`
    );
    spectator.hostFixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('onInit', () => {
    it('should call showSelectionOnMap and resetFilters, ()', () => {
      spectator.component.ngOnInit();

      expect(spyOnShowSelectionsOnMap).toHaveBeenCalled();
      expect(spyOnResetFilters).toHaveBeenCalledWith([
        FilterName.ACTIVITEIT,
        FilterName.DOCUMENTEN,
        FilterName.GEBIEDEN,
      ]);
    });
  });
});
