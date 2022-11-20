import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { StructuurElementenFiltersComponent } from '~viewer/documenten/components/structuur-elementen-filters/structuur-elementen-filters.component';
import { mockStructuurElementenFilter } from '~viewer/documenten/+state/structuurelement-filter/structuurelement-filter.selectors.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentenFacade } from '~viewer/documenten/+state/documenten.facade';
import { derivedLoadingState } from '~general/utils/store.utils';
import { LoadingState } from '~model/loading-state.enum';

describe('StructuurElementenFiltersComponent', () => {
  let spectator: Spectator<StructuurElementenFiltersComponent>;

  const createComponent = createComponentFactory({
    component: StructuurElementenFiltersComponent,
    providers: [mockProvider(DocumentenFacade)],
    imports: [RouterTestingModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.fixture.detectChanges();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show mockFilters', () => {
    spectator.component.filter$ = of(mockStructuurElementenFilter);
    spectator.component.status$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.fixture.detectChanges();
    const filters = spectator.queryAll('li dso-label');

    expect(filters.length).toEqual(1);
    expect(filters[0].innerHTML).toContain(mockStructuurElementenFilter.beschrijving);
  });

  it('should emit remove on click', () => {
    spyOn(spectator.component.removeStructuurelementFilter, 'emit');
    spectator.component.filter$ = of(mockStructuurElementenFilter);
    spectator.component.status$ = of(derivedLoadingState(LoadingState.RESOLVED));
    spectator.fixture.detectChanges();
    spectator.triggerEventHandler('li dso-label', 'dsoRemoveClick', null);
    spectator.fixture.detectChanges();

    expect(spectator.component.removeStructuurelementFilter.emit).toHaveBeenCalledWith(mockStructuurElementenFilter);
  });
});
