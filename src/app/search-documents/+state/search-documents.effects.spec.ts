import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import initialState from '~mocks/initial-state';
import { SearchDocumentsEffects } from './search-documents.effects';
import { LoadingState } from '~model/loading-state.enum';
import { Title } from '@angular/platform-browser';
import { IhrProvider } from '~providers/ihr.provider';
import { OzonProvider } from '~providers/ozon.provider';
import { featureKey } from './search-documents.reducer';
import * as SearchDocumentsActions from './search-documents.actions';
import { mockPlanSuggesties, mockRegelingSuggesties } from './search-documents.reducer.spec';

describe('SearchDocumentsEffects', () => {
  let spectator: SpectatorService<SearchDocumentsEffects>;
  let actions$: Observable<Action>;
  let ihrProvider: SpyObject<IhrProvider>;
  let ozonProvider: SpyObject<OzonProvider>;

  const localInitialState = {
    ...initialState,
    [featureKey]: {
      activeLocation: null,
      status: LoadingState.RESOLVED,
    },
  } as any;

  const createService = createServiceFactory({
    service: SearchDocumentsEffects,
    providers: [
      provideMockStore({
        initialState: localInitialState,
      }),
      provideMockActions(() => actions$),
      mockProvider(Title),
    ],
    mocks: [IhrProvider, OzonProvider],
  });

  beforeEach(() => {
    spectator = createService();
    ihrProvider = spectator.inject(IhrProvider);
    ozonProvider = spectator.inject(OzonProvider);
  });

  describe('loadSuggestions$', () => {
    it('should return success and with result', done => {
      ihrProvider.fetchPlanSuggestions$.and.returnValue(of(mockPlanSuggesties));
      ozonProvider.fetchRegelingSuggestions$.and.returnValue(of(mockRegelingSuggesties));

      actions$ = of(SearchDocumentsActions.SearchSuggestions({ value: 'zoek' }));

      spectator.service.loadSuggestions$.subscribe(actual => {
        const expected = SearchDocumentsActions.SearchSuggestionsSuccess({
          plannen: mockPlanSuggesties,
          regelingen: mockRegelingSuggesties,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('dontLoadSuggestions$', () => {
    it('should return success and with undefined result', done => {
      actions$ = of(SearchDocumentsActions.SearchSuggestions({ value: '' }));

      spectator.service.dontLoadSuggestions$.subscribe(actual => {
        const expected = SearchDocumentsActions.ResetSuggestions();

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
