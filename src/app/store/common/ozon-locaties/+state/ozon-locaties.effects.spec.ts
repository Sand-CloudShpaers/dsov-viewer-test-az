import { fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import initialState from '~mocks/initial-state';
import { LocationType } from '~model/internal/active-location-type.model';
import { LoadingState } from '~model/loading-state.enum';
import { LocatieZoekgebieden } from '~ozon-model/locatieZoekgebieden';
import { Locatie } from '~ozon-model/locatie';
import { OntwerpLocatieZoekgebieden } from '~ozon-model/ontwerpLocatieZoekgebieden';
import { commonRootKey, State } from '~store/common';
import { ozonLocatiesRootKey } from '~store/common/ozon-locaties/+state/ozon-locaties.reducer';
import { OzonProvider } from '~providers/ozon.provider';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import * as OzonLocatiesActions from './ozon-locaties.actions';
import { OzonLocatiesEffects } from './ozon-locaties.effects';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import WKT from 'ol/format/WKT';

describe('OzonLocatiesEffects', () => {
  let spectator: SpectatorService<OzonLocatiesEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let ozonProvider: SpyObject<OzonProvider>;

  const createService = createServiceFactory({
    service: OzonLocatiesEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockStore({ initialState }),
      provideMockActions(() => actions$),
      mockProvider(PortaalSessionPutService),
    ],
    mocks: [OzonProvider],
  });

  beforeEach(() => {
    spectator = createService();
    store$ = spectator.inject(MockStore);
    ozonProvider = spectator.inject(OzonProvider);
  });

  describe('updateFiltersSuccess$', () => {
    const locatieFilter: LocatieFilter = {
      id: 'adres',
      name: 'Adres',
      geometry: new WKT().readGeometry('MULTIPOLYGON(((128560 453107,129118 452937,129299 452854,129682 452722)))', {
        dataProjection: 'EPSG:28992',
      }),
      huisnummer: {
        label: '1',
        aanduidingId: '12345',
        olGeometry: null,
      },
      straat: 'Dorpstraat',
      postcode: '1000AA',
      source: LocationType.Adres,
      pdokId: 'pdokId',
    };

    it('should start loading', done => {
      store$.setState({
        ...initialState,
        filter: { filterOptions: { [FilterName.LOCATIE]: [locatieFilter] } },
      } as any);

      actions$ = of(
        FilterActions.UpdateFiltersSuccess({
          filterOptions: { [FilterName.LOCATIE]: [locatieFilter] },
          commands: [],
        })
      );
      spectator.service.updateFiltersSuccess$.subscribe(actual => {
        const expected = OzonLocatiesActions.loading({ activeLocation: locatieFilter, timeTravelDate: null });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should NOT start loading', fakeAsync(() => {
      store$.setState({
        [commonRootKey]: {
          [ozonLocatiesRootKey]: {
            locatieIds: [{} as Locatie],
            ontwerpLocatieIds: [],
            omgevingsplanPons: false,
            status: LoadingState.IDLE,
          },
        },
        filter: { filterOptions: {} },
      } as any);

      actions$ = of(
        FilterActions.UpdateFiltersSuccess({
          filterOptions: {},
          commands: [],
        })
      );

      let result;
      spectator.service.updateFiltersSuccess$.subscribe(actual => (result = actual));
      tick(jasmine.DEFAULT_TIMEOUT_INTERVAL);

      expect(result).toBeUndefined();
    }));
  });

  describe('loadOzonLocaties$', () => {
    let activeLocation: LocatieFilter;

    beforeEach(() => {
      activeLocation = {
        id: 'adres',
        name: 'Adres',
        geometry: null,
        huisnummer: {
          label: '1',
          aanduidingId: '12345',
          olGeometry: null,
        },
        straat: 'Dorpstraat',
        postcode: '1000AA',
        source: LocationType.Adres,
        pdokId: 'pdokId',
      };
    });

    it('should load Ozon Locaties', done => {
      const locatieZoekgebieden: LocatieZoekgebieden = {
        _embedded: {
          locatieidentificaties: ['a', 'b'],
          omgevingsplanPons: true,
        },
      };
      const ontwerpZoekgebieden: OntwerpLocatieZoekgebieden = {
        _embedded: {
          technischIds: ['id_id2'],
        },
      };

      ozonProvider.fetchOzonLocatiesByGeo$.and.returnValue(of([locatieZoekgebieden, ontwerpZoekgebieden]));
      actions$ = of(OzonLocatiesActions.loading({ activeLocation }));

      spectator.service.loadOzonLocaties$.subscribe(actual => {
        const expected = OzonLocatiesActions.loadSuccess({
          locatieIds: ['a', 'b'],
          ontwerpLocatieTechnischIds: ['id_id2'],
          omgevingsplanPons: true,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('kaput');
      ozonProvider.fetchOzonLocatiesByGeo$.and.returnValue(throwError(() => error));
      actions$ = of(OzonLocatiesActions.loading({ activeLocation }));
      spectator.service.loadOzonLocaties$.subscribe(actual => {
        const expected = OzonLocatiesActions.loadError({ error });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
