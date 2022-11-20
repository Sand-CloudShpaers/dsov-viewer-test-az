import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { MockComponent } from 'ng-mocks';
import { LocationComponent } from './location.component';
import { SearchFacade } from '~viewer/search/+state/search.facade';
import { of } from 'rxjs';
import { FilterFacade } from '~viewer/filter/filter.facade';
import { LocationType } from '~model/internal/active-location-type.model';

describe('LocationComponent', () => {
  const spyOn_resetLocationSuggestions = jasmine.createSpy('spyOn_resetLocationSuggestions()');
  const spyOn_fetchLocationSuggestions = jasmine.createSpy('spyOn_fetchLocationSuggestions');

  let spectator: Spectator<LocationComponent>;
  const createComponent = createComponentFactory({
    component: LocationComponent,
    providers: [
      provideMockStore({ initialState }),
      mockProvider(SearchFacade),
      mockProvider(FilterFacade, {
        resetLocationSuggestions: spyOn_resetLocationSuggestions,
        fetchLocationSuggestions: spyOn_fetchLocationSuggestions,
      }),
    ],
    declarations: [MockComponent(LocationComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.suggestions$ = of([]);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show and open suggestion', () => {
    const suggestion = {
      detail: {
        name: 'test',
        source: LocationType.Adres,
        pdokId: 'id',
      },
    } as CustomEvent;
    spyOn(spectator.component.changeLocation, 'emit');
    spectator.component.select(suggestion);

    spectator.detectChanges();

    expect(spectator.component.changeLocation.emit).toHaveBeenCalledWith({
      id: 'id',
      source: LocationType.Adres,
      name: 'test',
      pdokId: 'id',
      geometry: null,
    });
  });

  describe('search', () => {
    it('should fetch location suggestion', () => {
      spectator.component.search({
        detail: 'test',
      } as CustomEvent);

      expect(spyOn_fetchLocationSuggestions).toHaveBeenCalledWith('test');
    });
  });

  describe('ngOnDestroy', () => {
    it('should call reset location', () => {
      spectator.component.ngOnDestroy();

      expect(spyOn_resetLocationSuggestions).toHaveBeenCalled();
    });
  });
});
