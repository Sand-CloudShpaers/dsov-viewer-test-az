import { createServiceFactory, mockProvider, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import initialState from '~mocks/initial-state';
import { LocatieFilterEffects } from './locatie-filter.effects';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import * as SearchActions from '~viewer/search/+state/search.actions';
import { searchKey, State } from '~store/state';
import { LoadingState } from '~model/loading-state.enum';
import { PdokService } from '~viewer/search/services/pdok-service';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';
import { LocationType } from '~model/internal/active-location-type.model';
import WKT from 'ol/format/WKT';
import { GeoUtils } from '~general/utils/geo.utils';
import GeoJSON from 'ol/format/GeoJSON';
import { Geometry, Point } from 'ol/geom';
import { perceelMock } from '~viewer/search/mocks/pdok-perceel-mock';
import { adresMock } from '~viewer/search/mocks/pdok-adres-mock';
import { stripOl } from '~general/utils/test.utils';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { SearchLocationService } from '~services/search-location.service';
import { FetchLocationInfoService } from '~viewer/kaart/services/fetch-location-info.service';
import { FilterName, LocatieFilter } from '~viewer/filter/types/filter-options';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { Huisnummer } from '~model/huisnummer';
import { SearchMode } from '~viewer/search/types/search-mode';
import * as OzonLocatiesActions from '~store/common/ozon-locaties/+state/ozon-locaties.actions';

describe('LocatieFilterEffects', () => {
  let spectator: SpectatorService<LocatieFilterEffects>;
  let actions$: Observable<Action>;
  let store$: MockStore<State>;
  let pdokService: SpyObject<PdokService>;
  let fetchLocationInfoService: SpyObject<FetchLocationInfoService>;
  let searchLocationService: SpyObject<SearchLocationService>;
  const spyOnDisplayError = jasmine.createSpy('spyOnDisplayError');
  const spyOn_sendLocationToPortal = jasmine.createSpy('spyOn_sendLocationToPortal');

  const localInitialState = {
    ...initialState,
    [searchKey]: {
      LocatieFilter: null,
      status: LoadingState.RESOLVED,
    },
  } as any;

  const createService = createServiceFactory({
    service: LocatieFilterEffects,
    providers: [
      provideMockStore({
        initialState: localInitialState,
      }),
      provideMockActions(() => actions$),
      mockProvider(PortaalSessionPutService, {
        sendLocationToPortal: spyOn_sendLocationToPortal,
      }),
      mockProvider(DisplayErrorInfoMessagesService, {
        error: spyOnDisplayError,
      }),
    ],
    mocks: [PdokService, FetchLocationInfoService, SearchLocationService],
  });

  beforeEach(() => {
    spectator = createService();
    pdokService = spectator.inject(PdokService);
    fetchLocationInfoService = spectator.inject(FetchLocationInfoService);
    searchLocationService = spectator.inject(SearchLocationService);
    store$ = spectator.inject(MockStore);
    spyOn(store$, 'dispatch').and.stub();
  });

  describe('updateLocationFilter$', () => {
    const locatieFilter: LocatieFilter = {
      id: 'locatie',
      name: 'locatie',
      geometry: null,
    };
    it('should enrich location, when location has pdokId', done => {
      const filter = {
        ...locatieFilter,
        source: LocationType.Perceel,
        perceelcode: '12345',
        pdokId: '12345',
      };

      actions$ = of(
        FilterActions.UpdateFilters({
          filterOptions: { [FilterName.LOCATIE]: [filter] },
          commands: [],
        })
      );

      spectator.service.updateLocationFilter$.subscribe(actual => {
        const expected = FilterActions.LocatieLookup({
          locatie: filter,
          commands: [],
        });

        expect(store$.dispatch).toHaveBeenCalledWith(OzonLocatiesActions.reset());
        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should enrich location, when location has no pdokId', done => {
      const filter = {
        ...locatieFilter,
        source: LocationType.Perceel,
        perceelcode: '12345',
      };

      actions$ = of(
        FilterActions.UpdateFilters({
          filterOptions: { [FilterName.LOCATIE]: [filter] },
          commands: [],
        })
      );

      spectator.service.updateLocationFilter$.subscribe(actual => {
        const expected = FilterActions.LocatieSuggest({
          locatie: filter,
          commands: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should enrich location, when location is coordinates', done => {
      const filter = {
        ...locatieFilter,
        source: LocationType.CoordinatenRD,
        coordinaten: {
          [ZoekLocatieSystem.RD]: [10, 10],
          system: ZoekLocatieSystem.RD,
        },
      };

      actions$ = of(
        FilterActions.UpdateFilters({
          filterOptions: { [FilterName.LOCATIE]: [filter] },
          commands: [],
        })
      );

      spectator.service.updateLocationFilter$.subscribe(actual => {
        const expected = FilterActions.SearchWithCoordinates({
          locatie: filter,
          commands: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('suggestLocation$', () => {
    const filter: LocatieFilter = {
      id: 'locatie',
      name: 'locatie',
      geometry: null,
    };

    it('should enrich location, when location has pdokId', done => {
      pdokService.suggestLocations$.and.returnValue(
        of([
          {
            type: LocationType.Adres,
            weergavenaam: 'adres',
            id: '12345',
          },
        ])
      );

      actions$ = of(
        FilterActions.LocatieSuggest({
          locatie: filter,
          commands: [],
        })
      );

      spectator.service.suggestLocation$.subscribe(actual => {
        const expected = FilterActions.LocatieLookup({
          locatie: {
            ...filter,
            pdokId: '12345',
          },
          commands: [],
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should return error, when location is incorrect', done => {
      const error = new Error('stuk');
      pdokService.suggestLocations$.and.returnValue(throwError(() => error));

      actions$ = of(
        FilterActions.LocatieSuggest({
          locatie: filter,
          commands: [],
        })
      );

      spectator.service.suggestLocation$.subscribe(actual => {
        const expected = FilterActions.LoadLocatieFilterError({
          error: {
            name: 'Locatie',
            message:
              'Uw gekozen locatie is niet goed. U kunt alleen kiezen voor een adres, perceel, coördinaten of een getekend gebied.',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loading', () => {
    const result = {
      bron: 'Bestuurlijke Grenzen',
      identificatie: '0344',
      provinciecode: 'PV26',
      type: LocationType.Adres,
      provincienaam: 'Utrecht',
      centroide_ll: 'POINT(5.07475437 52.09113798)',
      gemeentecode: '0344',
      weergavenaam: 'Adres Utrecht',
      suggest: ['Adres Utrecht'],
      geometrie_rd: 'MULTIPOLYGON(((128560 453107,129118 452937,129299 452854,129682 452722)))',
      provincieafkorting: 'UT',
      centroide_rd: 'POINT(133587.182 455921.594)',
      id: 'gem-df0ca8ab37eccea5217e2a13f74d2833',
      gemeentenaam: 'Adres Utrecht',
      geometrie_ll: 'MULTIPOLYGON(((5.00162 52.06562,5.00976 52.06412,5.01241 52.06338,5.01801 52.06222)))',
      _version_: 1704696734541676544,
      typesortering: 1.0,
      shard: 'bag',
    };

    it('should lookup', done => {
      pdokService.lookupLocation$.and.returnValue(
        of({
          numFound: 1,
          start: 1,
          maxScore: 1,
          docs: [result],
        })
      );

      actions$ = of(
        FilterActions.LocatieLookup({
          locatie: { id: result.weergavenaam, name: result.weergavenaam, geometry: null, pdokId: result.id },
          commands: [],
        })
      );

      spectator.service.lookupLocation$.subscribe(actual => {
        const expected = FilterActions.LocatieLoadExactGeometry({
          locatie: {
            id: result.id,
            name: result.weergavenaam,
            gemeentecode: result.gemeentecode,
            woonplaatscode: undefined,
            woonplaatsnaam: undefined,
            geometry: new WKT().readGeometry(result.geometrie_rd, {
              dataProjection: 'EPSG:28992',
            }),
            source: result.type,
            perceelcode: result.identificatie,
            provincie: result.provincienaam,
            pdokId: result.id,
          },
          pdokLookup: result,
          commands: [],
        });

        stripOl((actual as any).locatie.geometry);
        stripOl((expected as any).locatie.geometry);
        stripOl((actual as any).pdokLookup.geometry_rd);
        stripOl((expected as any).pdokLookup.geometry_rd);

        expect(actual).toEqual(expected);

        done();
      });
    });
  });

  describe('loadExactGeometry, with Adres', () => {
    it('should get perceel', done => {
      const locatieFilter: LocatieFilter = {
        id: 'adres',
        name: 'Adres',
        source: LocationType.Adres,
        geometry: null,
      };

      pdokService.getPercelen$.and.returnValue(of(adresMock));

      actions$ = of(
        FilterActions.LocatieLoadExactGeometry({
          locatie: locatieFilter,
          pdokLookup: {
            bron: 'BAG',
            woonplaatscode: '2895',
            type: LocationType.Adres,
            woonplaatsnaam: 'IJsselmuiden',
            wijkcode: 'WK016603',
            huis_nlt: '8',
            openbareruimtetype: 'Weg',
            buurtnaam: 'Trekvaart',
            gemeentecode: '0166',
            rdf_seealso: 'http://bag.basisregistraties.overheid.nl/bag/id/nummeraanduiding/0166200000026010',
            weergavenaam: 'Trekschuit 8, 8271LD IJsselmuiden',
            suggest: ['Trekschuit 8, 8271LD IJsselmuiden', 'Trekschuit 8, 8271 LD IJsselmuiden'],
            straatnaam_verkort: 'Trekschuit',
            id: 'adr-66d8d9520b41190a6c4e0e05f3d128ea',
            gekoppeld_perceel: ['ISM02-B-7680'],
            gemeentenaam: 'Kampen',
            buurtcode: 'BU01660307',
            wijknaam: 'Wijk 03 IJsselmuiden',
            identificatie: '0166010000026010-0166200000026010',
            openbareruimte_id: '0166300000000752',
            waterschapsnaam: 'Waterschap Drents Overijsselse Delta',
            provinciecode: 'PV23',
            postcode: '8271LD',
            provincienaam: 'Overijssel',
            geometrie_ll: 'POINT(5.93206513 52.56232374)',
            centroide_ll: 'POINT(5.93206513 52.56232374)',
            nummeraanduiding_id: '0166200000026010',
            waterschapscode: '53',
            adresseerbaarobject_id: '0166010000026010',
            huisnummer: 8,
            provincieafkorting: 'OV',
            centroide_rd: 'POINT(191946.14 508440.765)',
            geometrie_rd: 'POINT(191946.14 508440.765)',
            straatnaam: 'Trekschuit',
            _version_: 1704687121976000512,
            typesortering: 4.0,
            sortering: 8.0,
            shard: 'bag',
          },
          commands: [],
        })
      );

      spectator.service.adres$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: [
              {
                ...locatieFilter,
                geometry: GeoUtils.getGeometryFromFeatures(new GeoJSON().readFeatures(adresMock)),
                postcode: '8271LD',
                straat: 'Trekschuit',
                huisnummer: {
                  label: '8',
                  aanduidingId: '0166200000026010',
                  olGeometry: new WKT().readGeometry('POINT(191946.14 508440.765)'),
                },
              },
            ],
          },
          commands: [],
        });

        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl((expected as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].huisnummer.olGeometry);
        stripOl((expected as any).filterOptions[FilterName.LOCATIE][0].huisnummer.olGeometry);

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadExactGeometry, with Adres, without Gekoppelde Percelen', () => {
    it('should get perceel', done => {
      const locatieFilter: LocatieFilter = {
        id: 'adres',
        name: 'Adres',
        source: LocationType.Adres,
        geometry: null,
      };

      pdokService.getPercelen$.and.returnValue(of(adresMock));

      actions$ = of(
        FilterActions.LocatieLoadExactGeometry({
          locatie: locatieFilter,
          pdokLookup: {
            bron: 'BAG',
            woonplaatscode: '2895',
            type: LocationType.Adres,
            woonplaatsnaam: 'IJsselmuiden',
            wijkcode: 'WK016603',
            huis_nlt: '8',
            openbareruimtetype: 'Weg',
            buurtnaam: 'Trekvaart',
            gemeentecode: '0166',
            rdf_seealso: 'http://bag.basisregistraties.overheid.nl/bag/id/nummeraanduiding/0166200000026010',
            weergavenaam: 'Trekschuit 8, 8271LD IJsselmuiden',
            suggest: ['Trekschuit 8, 8271LD IJsselmuiden', 'Trekschuit 8, 8271 LD IJsselmuiden'],
            straatnaam_verkort: 'Trekschuit',
            id: 'adr-66d8d9520b41190a6c4e0e05f3d128ea',
            gemeentenaam: 'Kampen',
            buurtcode: 'BU01660307',
            wijknaam: 'Wijk 03 IJsselmuiden',
            identificatie: '0166010000026010-0166200000026010',
            openbareruimte_id: '0166300000000752',
            waterschapsnaam: 'Waterschap Drents Overijsselse Delta',
            provinciecode: 'PV23',
            postcode: '8271LD',
            provincienaam: 'Overijssel',
            geometrie_ll: 'POINT(5.93206513 52.56232374)',
            centroide_ll: 'POINT(5.93206513 52.56232374)',
            nummeraanduiding_id: '0166200000026010',
            waterschapscode: '53',
            adresseerbaarobject_id: '0166010000026010',
            huisnummer: 8,
            provincieafkorting: 'OV',
            centroide_rd: 'POINT(191946.14 508440.765)',
            geometrie_rd: 'POINT(191946.14 508440.765)',
            straatnaam: 'Trekschuit',
            _version_: 1704687121976000512,
            typesortering: 4.0,
            sortering: 8.0,
            shard: 'bag',
          },
          commands: [],
        })
      );

      spectator.service.adresZonderGekoppeldPerceel$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: [
              {
                ...locatieFilter,
                geometry: new WKT().readGeometry('POINT(191946.14 508440.765)'),
                postcode: '8271LD',
                straat: 'Trekschuit',
                huisnummer: {
                  label: '8',
                  aanduidingId: '0166200000026010',
                  olGeometry: new WKT().readGeometry('POINT(191946.14 508440.765)'),
                },
              },
            ],
          },
          commands: [],
        });

        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl((expected as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].huisnummer.olGeometry);
        stripOl((expected as any).filterOptions[FilterName.LOCATIE][0].huisnummer.olGeometry);

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadExactGeometry, with Perceel', () => {
    it('should get perceel', done => {
      const locatieFilter: LocatieFilter = {
        id: 'perceel',
        name: 'Perceel',
        source: LocationType.Perceel,
        perceelcode: '12345',
        geometry: null,
      };

      pdokService.getPercelen$.and.returnValue(of(perceelMock));

      actions$ = of(
        FilterActions.LocatieLoadExactGeometry({
          locatie: locatieFilter,
          pdokLookup: null,
          commands: [],
        })
      );

      spectator.service.perceel$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: [
              {
                ...locatieFilter,
                geometry: GeoUtils.getGeometryFromFeatures(new GeoJSON().readFeatures(perceelMock)),
              },
            ],
          },
          commands: [],
        });

        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl((expected as any).filterOptions[FilterName.LOCATIE][0].geometry);

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadExactGeometry, with incorrect Perceel', () => {
    it('should get error', done => {
      const locatieFilter: LocatieFilter = {
        id: 'perceel',
        name: 'Perceel',
        source: LocationType.Perceel,
        perceelcode: '12345',
        geometry: null,
      };

      pdokService.getPercelen$.and.returnValue(
        of({
          ...perceelMock,
          features: [],
        })
      );

      actions$ = of(
        FilterActions.LocatieLoadExactGeometry({
          locatie: locatieFilter,
          pdokLookup: null,
          commands: [],
        })
      );

      spectator.service.perceel$.subscribe(actual => {
        const expected = FilterActions.LoadLocatieFilterError({
          error: {
            name: 'Perceel',
            message: 'Het perceel kan niet gevonden worden.',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('searchWithCoordinatesRD', () => {
    it('should load success', done => {
      const locatieFilter: LocatieFilter = {
        id: 'coordinatenRD',
        name: '10, 20',
        source: LocationType.CoordinatenRD,
        geometry: new Point([10, 20]),
        coordinaten: {
          [ZoekLocatieSystem.RD]: [10, 20],
          system: ZoekLocatieSystem.RD,
        },
      };

      actions$ = of(
        FilterActions.SearchWithCoordinates({
          locatie: {
            id: 'coordinatenRD',
            name: '10, 20',
            geometry: null,
            coordinaten: {
              [ZoekLocatieSystem.RD]: [10, 20],
              system: ZoekLocatieSystem.RD,
            },
          },
          commands: [],
        })
      );

      fetchLocationInfoService.fetchOpenbareLichamen$.and.returnValue(
        of([
          {
            bestuurslaag: '',
            code: '',
            naam: '',
            type: '',
          },
        ])
      );

      spectator.service.searchWithCoordinatesRD$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: [locatieFilter],
          },
          commands: [],
        });
        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl(expected.filterOptions[FilterName.LOCATIE][0].geometry);

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('searchWithCoordinatesRD, outside NL', () => {
    it('should load failure', done => {
      actions$ = of(
        FilterActions.SearchWithCoordinates({
          locatie: {
            id: ZoekLocatieSystem.RD,
            name: ZoekLocatieSystem.RD,
            geometry: null,
            coordinaten: {
              [ZoekLocatieSystem.RD]: [10, 20],
              system: ZoekLocatieSystem.RD,
            },
          },
          commands: [],
        })
      );

      fetchLocationInfoService.fetchOpenbareLichamen$.and.returnValue(of([]));

      spectator.service.searchWithCoordinatesRD$.subscribe(actual => {
        const expected = FilterActions.LoadLocatieFilterError({
          error: {
            stack: 'Coördinaten',
            name: 'Buiten Nederland',
            message: 'Het zoekgebied bevindt zich buiten Nederland.',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('searchWithCoordinatesETRS89', () => {
    it('should load success', done => {
      const locatieFilter: LocatieFilter = {
        id: '20, 10',
        name: '20, 10',
        source: LocationType.CoordinatenETRS89,
        geometry: new Point([5, 5]),
        coordinaten: {
          [ZoekLocatieSystem.RD]: [5, 5],
          [ZoekLocatieSystem.ETRS89]: [10, 20],
          system: ZoekLocatieSystem.ETRS89,
        },
        noZoom: undefined,
      };

      actions$ = of(
        FilterActions.SearchWithCoordinates({
          locatie: {
            id: '20, 10',
            name: '20, 10',
            geometry: null,
            coordinaten: {
              [ZoekLocatieSystem.ETRS89]: [10, 20],
              system: ZoekLocatieSystem.ETRS89,
            },
          },
          commands: [],
        })
      );

      searchLocationService.lookupRdNapTrans$.and.returnValue(of([5, 5]));

      spectator.service.searchWithCoordinatesETRS89$.subscribe(actual => {
        const expected = FilterActions.UpdateFilters({
          filterOptions: { [FilterName.LOCATIE]: [locatieFilter] },
          commands: [],
        });

        stripOl((actual as any).filterOptions[FilterName.LOCATIE][0].geometry);
        stripOl(expected.filterOptions[FilterName.LOCATIE][0].geometry);

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should loadError with a generic message', done => {
      actions$ = of(
        FilterActions.SearchWithCoordinates({
          locatie: {
            id: 'coordinatenETRS89',
            name: '10, 20',
            geometry: null,
            coordinaten: {
              [ZoekLocatieSystem.ETRS89]: [10, 20],
              system: ZoekLocatieSystem.ETRS89,
            },
          },
          commands: [],
        })
      );

      const error = new Error('some kind of error');
      error.name = 'someError';
      searchLocationService.lookupRdNapTrans$.and.returnValue(throwError(() => error));

      spectator.service.searchWithCoordinatesETRS89$.subscribe(actual => {
        const expected = FilterActions.LoadLocatieFilterError({
          error: {
            name: 'Coördinaten',
            message: 'De coördinaten kunnen niet gevonden worden',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should loadError with a specific message "Buiten Nederland"', done => {
      actions$ = of(
        FilterActions.SearchWithCoordinates({
          locatie: {
            id: 'coordinatenETRS89',
            name: '10, 20',
            geometry: null,
            coordinaten: {
              [ZoekLocatieSystem.ETRS89]: [10, 20],
              system: ZoekLocatieSystem.ETRS89,
            },
          },
          commands: [],
        })
      );

      const error = new Error('Het zoekgebied bevindt zich buiten Nederland.');
      error.name = 'Buiten Nederland';
      searchLocationService.lookupRdNapTrans$.and.returnValue(throwError(() => error));

      spectator.service.searchWithCoordinatesETRS89$.subscribe(actual => {
        const expected = FilterActions.LoadLocatieFilterError({
          error: {
            name: 'Buiten Nederland',
            message: 'Het zoekgebied bevindt zich buiten Nederland.',
          },
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('updateFilters, with complete location', () => {
    it('should map to showRepresentationOnMap for locatieFilter', done => {
      const geometry: Geometry = new Point([10, 20]);
      const huisnummer: Huisnummer = {
        label: '1',
        aanduidingId: '12345',
        olGeometry: null,
      };
      const locatieFilter: LocatieFilter = {
        id: 'Adres',
        name: 'Adres',
        source: LocationType.Adres,
        huisnummer,
        geometry,
      };

      actions$ = of(
        FilterActions.UpdateFilters({ filterOptions: { [FilterName.LOCATIE]: [locatieFilter] }, commands: [] })
      );

      spectator.service.updateFilters$.subscribe(() => {
        expect(spyOn_sendLocationToPortal).toHaveBeenCalledWith(locatieFilter);
        done();
      });
    });
  });

  describe('update search method', () => {
    it('should update search methode, with coordinaten', done => {
      const locatieFilter: LocatieFilter = {
        id: 'coordinatenETRS89',
        name: '10, 20',
        geometry: null,
        source: LocationType.CoordinatenETRS89,
        coordinaten: {
          [ZoekLocatieSystem.ETRS89]: [10, 20],
          system: ZoekLocatieSystem.ETRS89,
        },
      };

      actions$ = of(
        FilterActions.UpdateFilters({ filterOptions: { [FilterName.LOCATIE]: [locatieFilter] }, commands: [] })
      );

      spectator.service.updateSearchMethod$.subscribe(actual => {
        const expected = SearchActions.setSearchMode({ searchMode: SearchMode.COORDINATEN });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });

  describe('loadError', () => {
    it('should display error', () => {
      const error: Error = {
        name: '',
        message: '',
      };

      actions$ = of(FilterActions.LoadLocatieFilterError({ error }));

      spectator.service.loadError$.subscribe(() => {
        expect(spyOnDisplayError).toHaveBeenCalled();
      });
    });
  });
});
