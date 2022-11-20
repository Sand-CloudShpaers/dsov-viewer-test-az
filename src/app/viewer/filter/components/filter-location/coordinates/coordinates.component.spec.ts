import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import { MockComponent } from 'ng-mocks';
import { CoordinatesComponent } from './coordinates.component';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { LocationType } from '~model/internal/active-location-type.model';

describe('CoordinatesComponent', () => {
  let spectator: Spectator<CoordinatesComponent>;
  const createComponent = createComponentFactory({
    component: CoordinatesComponent,
    providers: [
      provideMockStore({ initialState }),
      {
        provide: LocatieFilterService,
        useValue: {
          resetState: () => {},
          getParsedCoordinates: () => [155000, 463000],
        },
      },
    ],
    declarations: [MockComponent(CoordinatesComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spyOn(spectator.component.changeCoordinates, 'emit');
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should open coordinates on handleInput', () => {
    spectator.component.handleInput({
      currentTarget: { value: '155000,463000' },
    } as unknown as Event);
    spectator.detectChanges();

    spectator.click('button');

    expect(spectator.component.changeCoordinates.emit).toHaveBeenCalledWith({
      id: '155000,463000',
      source: LocationType.CoordinatenRD,
      coordinaten: {
        [ZoekLocatieSystem.RD]: [155000, 463000],
        system: ZoekLocatieSystem.RD,
      },
      name: '155000,463000',
      geometry: null,
    });
  });

  it('should emit value, when radio change', () => {
    spectator.component.autoSearch = true;
    spectator.component.searchValue = '155000, 463000';
    spectator.component.handleRadio(true);

    expect(spectator.component.changeCoordinates.emit).toHaveBeenCalledWith({
      id: '155000, 463000',
      source: LocationType.CoordinatenRD,
      coordinaten: {
        [ZoekLocatieSystem.RD]: [155000, 463000],
        system: ZoekLocatieSystem.RD,
      },
      name: '155000, 463000',
      geometry: null,
    });
  });

  describe('search', () => {
    it('should open coordinates RD', () => {
      spectator.component.searchValue = '155000, 463000';
      spectator.component.search();

      expect(spectator.component.changeCoordinates.emit).toHaveBeenCalledWith({
        id: '155000, 463000',
        source: LocationType.CoordinatenRD,
        coordinaten: {
          [ZoekLocatieSystem.RD]: [155000, 463000],
          system: ZoekLocatieSystem.RD,
        },
        name: '155000, 463000',
        geometry: null,
      });
    });

    it('should open coordinates ETRS89', () => {
      spectator.component.searchValue = '155000, 463000';
      spectator.component.isRd = false;
      spectator.component.search();

      expect(spectator.component.changeCoordinates.emit).toHaveBeenCalledWith({
        source: LocationType.CoordinatenETRS89,
        coordinaten: {
          [ZoekLocatieSystem.ETRS89]: [463000, 155000],
          system: ZoekLocatieSystem.ETRS89,
        },
        id: '155000, 463000',
        name: '155000, 463000',
        geometry: null,
      });
    });
  });
});

describe('CoordinatesComponent, with other provider', () => {
  let spectator: Spectator<CoordinatesComponent>;
  const createComponent = createComponentFactory({
    component: CoordinatesComponent,
    providers: [
      provideMockStore({ initialState }),
      {
        provide: LocatieFilterService,
        useValue: {
          getParsedCoordinates: (): number[] => null,
        },
      },
    ],
    declarations: [MockComponent(CoordinatesComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spyOn(spectator.component.changeCoordinates, 'emit');
  });

  describe('search with null', () => {
    it('should not open coordinates', () => {
      spectator.component.searchValue = null;
      spectator.component.search();

      expect(spectator.component.changeCoordinates.emit).not.toHaveBeenCalled();
    });

    it('should emit changeLocation without coordinates when timetravelling', () => {
      spectator.component.searchValue = '';
      spectator.component.isTimeTravel = true;
      spectator.component.search();

      expect(spectator.component.changeCoordinates.emit).toHaveBeenCalledWith({
        source: LocationType.CoordinatenRD,
        name: '',
        id: '',
        geometry: null,
      });
    });
  });
});
