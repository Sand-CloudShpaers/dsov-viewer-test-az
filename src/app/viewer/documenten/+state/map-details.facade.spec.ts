import { TestBed } from '@angular/core/testing';
import { mockProvider } from '@ngneat/spectator';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { State } from '~store/common';
import { HighlightService } from '~viewer/kaart/services/highlight.service';
import { MapDetailsFacade } from '~viewer/documenten/+state/map-details.facade';
import { IhrProvider } from '~providers/ihr.provider';
import { of } from 'rxjs';
import { ImroPlanlagenService } from '../../kaart/services/imro-planlagen.service';
import initialState from '~mocks/initial-state';
import * as MapDetailsActions from './map-details/map-details.actions';
import { IMROCartografieInfoDetailVM } from '~viewer/documenten/types/map-details';
import { selectionMock } from '~store/common/selection/+state/selection-mock';

describe('MapDetailsFacade', () => {
  let mapDetailsFacade: MapDetailsFacade;
  let highlightService: HighlightService;
  let store$: Store<State>;
  const spyOn_resetStyleWithSelections = jasmine.createSpy('spyOn_resetStyleWithSelections');
  const maatvoeringDetail: IMROCartografieInfoDetailVM = {
    categorie: '',
    classificatie: 'wonen',
    naam: '',
    id: '123',
    type: 'Maatvoering',
    symboolcode: 'maatvoering',
    labels: ['wonen'],
    selected: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MapDetailsFacade,
        provideMockStore({ initialState }),
        mockProvider(ImroPlanlagenService, {
          resetStyleWithSelections: spyOn_resetStyleWithSelections,
        }),
        mockProvider(HighlightService),
        {
          provide: IhrProvider,
          useValue: {
            fetchMaatvoering$: () =>
              of({
                id: '',
                naam: '',
                omvang: [
                  {
                    naam: 'naam',
                    waarde: 'waarde',
                  },
                ],
                verwijzingNaarTekst: '',
                _links: null,
              }),
          },
        },
      ],
    });
    mapDetailsFacade = TestBed.inject(MapDetailsFacade);
    highlightService = TestBed.inject(HighlightService);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch').and.stub();
  });

  it('should be created', () => {
    expect(mapDetailsFacade).toBeTruthy();
  });

  describe('getMaatvoeringLabels$', () => {
    it('should return a list with maatvoering labels', () => {
      mapDetailsFacade.getMaatvoeringLabels$(maatvoeringDetail, 'NL.IMRO.leukplan').subscribe(data => {
        expect(data).toEqual(['naam: waarde']);
      });
    });
  });

  describe('showActiveMapDetails', () => {
    it('should dispatch showOnMap with symboolLocatiesWithLabels', () => {
      mapDetailsFacade.showMapDetails([selectionMock], 'NL.IMRO.leukplan');

      expect(store$.dispatch).toHaveBeenCalledWith(
        MapDetailsActions.showMapDetails({
          documentId: 'NL.IMRO.leukplan',
          selections: [selectionMock],
        })
      );
    });
  });

  it('should hoverIn', () => {
    mapDetailsFacade.addHighlight('NL.IMRO.highlightplan', ['123', '456']);

    expect(highlightService.addHighlightLayerIHR).toHaveBeenCalled();
  });

  it('should hoverOut', () => {
    mapDetailsFacade.removeHighlight();

    expect(highlightService.removeHighlightLayer).toHaveBeenCalled();
  });
});
