import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import initialState from '~mocks/initial-state';
import { GeometryFactory } from '~mocks/geometry-factory';
import { KaartService } from '~viewer/kaart/services/kaart.service';
import { LocationInfoNavigationService } from '~viewer/kaart/services/location-info-navigation.service';
import { LocatieFilterService } from '~viewer/filter/services/locatie-filter.service';
import { DrawComponent } from './draw.component';
import { DrawSearchService } from '~viewer/search/services/draw-search.service';
import { FilterFacade } from '~viewer/filter/filter.facade';

describe('DrawComponent', () => {
  const mockGeometry = GeometryFactory.createPolygon();
  const mockResult = {
    feature: {
      getGeometry: () => mockGeometry,
    },
  };

  const mockDrawEnd$ = new BehaviorSubject<any>(mockResult);

  let spectator: Spectator<DrawComponent>;
  const createComponent = createComponentFactory({
    component: DrawComponent,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockStore({ initialState }),
      {
        provide: LocationInfoNavigationService,
        useValue: {
          searchContour: () => {},
        },
      },
      {
        provide: DrawSearchService,
        useValue: {
          drawEnd$: mockDrawEnd$,
          draw: () => {},
          removeFromMap: () => {},
        },
      },
      mockProvider(FilterFacade),
    ],
    mocks: [KaartService, LocatieFilterService],
    declarations: [MockComponent(DrawComponent)],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.component.drawnGeometry = mockGeometry;
    spyOn(spectator.component.changeContour, 'emit');
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('handleOpen', () => {
    it('should emit changeLocation', () => {
      spectator.setInput({ isTimeTravel: true });
      spectator.component.handleOpen();

      expect(spectator.component.changeContour.emit).toHaveBeenCalled();
    });
  });

  describe('handleRestart', () => {
    it('should set zoomLevel to minimum, remove representation from map and start drawing', () => {
      const drawSearchService: DrawSearchService = TestBed.inject(DrawSearchService);
      const removeFromMapSpy = spyOn(drawSearchService, 'removeFromMap');
      const drawSpy = spyOn(drawSearchService, 'draw');

      spectator.component.handleRestart();

      expect(removeFromMapSpy).toHaveBeenCalled();
      expect(spectator.component.currentDrawState).toBe('drawing');
      expect(spectator.component.drawnGeometry).toBeNull();
      expect(drawSpy).toHaveBeenCalledWith('Polygon' as any);
    });
  });
});
