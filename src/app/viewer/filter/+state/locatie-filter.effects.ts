import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import Point from 'ol/geom/Point';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { GeoUtils } from '~general/utils/geo.utils';
import { LocationType } from '~model/internal/active-location-type.model';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { State } from '~store/state';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import * as OzonLocatiesActions from '~store/common/ozon-locaties/+state/ozon-locaties.actions';
import * as SearchActions from '~viewer/search/+state/search.actions';
import { DisplayErrorInfoMessagesService } from '~services/display-error-info-messages.service';
import { SearchLocationService } from '~services/search-location.service';
import { FetchLocationInfoService } from '~viewer/kaart/services/fetch-location-info.service';
import { PdokService } from '~viewer/search/services/pdok-service';
import { OpenbaarLichaam } from '~model/bestuurlijkegrenzen/openbare-lichamen';
import { FilterName } from '../types/filter-options';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { isLocationFilterComplete } from '../helpers/filters';
import { SearchMode } from '~viewer/search/types/search-mode';

@Injectable()
export class LocatieFilterEffects {
  public updateLocationFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.UpdateFilters),
      filter(
        action => action.filterOptions[FilterName.LOCATIE]?.length && !isLocationFilterComplete(action.filterOptions)
      ),
      map(action => {
        this.store.dispatch(OzonLocatiesActions.reset());

        const locatie = action.filterOptions[FilterName.LOCATIE][0];
        const commands = action.commands;
        if (
          ![LocationType.Contour, LocationType.CoordinatenRD, LocationType.CoordinatenETRS89].includes(locatie.source)
        ) {
          if (locatie.pdokId) {
            return FilterActions.LocatieLookup({ locatie, commands });
          } else {
            return FilterActions.LocatieSuggest({ locatie, commands });
          }
        }
        if ([LocationType.CoordinatenRD, LocationType.CoordinatenETRS89].includes(locatie.source)) {
          return FilterActions.SearchWithCoordinates({ locatie, commands });
        }
        return FilterActions.LoadLocatieFilterError({ error: { name: 'Locatie', message: 'Geen geldige locatie' } });
      })
    )
  );

  public updateFilters$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FilterActions.UpdateFilters),
        filter(action => isLocationFilterComplete(action.filterOptions)),
        map(action => {
          this.portaalSessionPutService.sendLocationToPortal(action.filterOptions[FilterName.LOCATIE][0]);
        })
      ),
    { dispatch: false }
  );

  public updateSearchMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.UpdateFilters),
      filter(action => !!action.filterOptions[FilterName.LOCATIE]?.length),
      map(action => {
        const source = action.filterOptions[FilterName.LOCATIE][0].source;
        let searchMode = SearchMode.LOCATIE; // default;

        if ([LocationType.CoordinatenRD, LocationType.CoordinatenETRS89].includes(source)) {
          searchMode = SearchMode.COORDINATEN;
        }
        return SearchActions.setSearchMode({ searchMode });
      })
    )
  );

  public suggestLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.LocatieSuggest),
      mergeMap(action =>
        this.pdokService.suggestLocations$(`fq=type:(adres OR perceel)&q=${action.locatie.id}`).pipe(
          map(response =>
            FilterActions.LocatieLookup({
              locatie: {
                ...action.locatie,
                // neem de eerste uit de suggestie lijst
                pdokId: response[0].id,
              },
              commands: action.commands,
            })
          ),
          catchError(() =>
            of(
              FilterActions.LoadLocatieFilterError({
                error: {
                  name: 'Locatie',
                  message:
                    'Uw gekozen locatie is niet goed. U kunt alleen kiezen voor een adres, perceel, coördinaten of een getekend gebied.',
                },
              })
            )
          )
        )
      )
    )
  );

  public lookupLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.LocatieLookup),
      filter(action => !!action.locatie.pdokId),
      mergeMap(action =>
        this.pdokService.lookupLocation$(`fl=*&id=${action.locatie.pdokId}`).pipe(
          map(response => {
            const result = response.docs[0];
            return FilterActions.LocatieLoadExactGeometry({
              locatie: {
                id: result.id,
                name: result.weergavenaam,
                gemeentecode: result.gemeentecode,
                woonplaatscode: result.woonplaatscode,
                woonplaatsnaam: result.woonplaatsnaam,
                geometry: new WKT().readGeometry(result.geometrie_rd, {
                  dataProjection: 'EPSG:28992',
                }),
                source: result.type,
                perceelcode: result.identificatie,
                provincie: result.provincienaam,
                pdokId: result.id,
              },
              pdokLookup: result,
              commands: action.commands,
            });
          }),
          catchError(() =>
            of(
              FilterActions.LoadLocatieFilterError({
                error: {
                  name: 'Locatie',
                  message: 'De locatie kan niet gevonden worden.',
                },
              })
            )
          )
        )
      )
    )
  );

  public adres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.LocatieLoadExactGeometry),
      filter(action => action.locatie.source === LocationType.Adres && !!action.pdokLookup.gekoppeld_perceel),
      mergeMap(action =>
        this.pdokService
          .getPercelen$(
            action.pdokLookup.gekoppeld_perceel.map(perceel => this.searchLocationService.extractPerceelCode(perceel))
          )
          .pipe(
            map(response =>
              FilterActions.UpdateFilters({
                filterOptions: {
                  [FilterName.LOCATIE]: [
                    {
                      ...action.locatie,
                      geometry:
                        // Controleer of de response van de opgevraagde percelen ook daadwerkelijk features bevat
                        // Wanneer dit niet het geval is dan gebruiken we de centroide van het adres als fallback
                        response.features?.length
                          ? GeoUtils.getGeometryFromFeatures(new GeoJSON().readFeatures(response))
                          : new WKT().readGeometry(action.pdokLookup.geometrie_rd),
                      postcode: action.pdokLookup.postcode,
                      straat: action.pdokLookup.straatnaam,
                      huisnummer: {
                        label: action.pdokLookup.huis_nlt,
                        aanduidingId: action.pdokLookup.nummeraanduiding_id,
                        olGeometry: new WKT().readGeometry(action.pdokLookup.geometrie_rd),
                      },
                    },
                  ],
                },
                commands: action.commands,
              })
            ),
            catchError(() =>
              of(
                FilterActions.LoadLocatieFilterError({
                  error: {
                    name: 'Adres',
                    message: 'Het adres kan niet gevonden worden.',
                  },
                })
              )
            )
          )
      )
    )
  );

  public adresZonderGekoppeldPerceel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.LocatieLoadExactGeometry),
      filter(action => action.locatie.source === LocationType.Adres && !action.pdokLookup.gekoppeld_perceel),
      map(action =>
        FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: [
              {
                ...action.locatie,
                geometry: new WKT().readGeometry(action.pdokLookup.geometrie_rd),
                postcode: action.pdokLookup.postcode,
                straat: action.pdokLookup.straatnaam,
                huisnummer: {
                  label: action.pdokLookup.huis_nlt,
                  aanduidingId: action.pdokLookup.nummeraanduiding_id,
                  olGeometry: new WKT().readGeometry(action.pdokLookup.geometrie_rd),
                },
              },
            ],
          },
          commands: action.commands,
        })
      )
    )
  );

  public perceel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.LocatieLoadExactGeometry),
      filter(action => action.locatie.source === LocationType.Perceel),
      mergeMap(action =>
        this.pdokService.getPercelen$([this.searchLocationService.extractPerceelCode(action.locatie.perceelcode)]).pipe(
          map(response => {
            if (!response['features'].length) {
              return FilterActions.LoadLocatieFilterError({
                error: {
                  name: 'Perceel',
                  message: 'Het perceel kan niet gevonden worden.',
                },
              });
            }
            return FilterActions.UpdateFilters({
              filterOptions: {
                [FilterName.LOCATIE]: [
                  {
                    ...action.locatie,
                    geometry: GeoUtils.getGeometryFromFeatures(new GeoJSON().readFeatures(response)),
                  },
                ],
              },
              commands: action.commands,
            });
          }),
          catchError(() =>
            of(
              FilterActions.LoadLocatieFilterError({
                error: {
                  name: 'Perceel',
                  message: 'Het perceel kan niet gevonden worden.',
                },
              })
            )
          )
        )
      )
    )
  );

  public searchWithCoordinatesRD$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.SearchWithCoordinates),
      filter(action => action.locatie?.coordinaten?.system === ZoekLocatieSystem.RD),
      mergeMap(action =>
        this.fetchLocationInfoService.fetchOpenbareLichamen$(action.locatie.coordinaten[ZoekLocatieSystem.RD]).pipe(
          map((response: OpenbaarLichaam[]) => {
            if (!response.length) {
              return FilterActions.LoadLocatieFilterError({
                error: {
                  stack: 'Coördinaten',
                  name: 'Buiten Nederland',
                  message: 'Het zoekgebied bevindt zich buiten Nederland.',
                },
              });
            }
            return FilterActions.UpdateFilters({
              filterOptions: {
                [FilterName.LOCATIE]: [
                  {
                    id: action.locatie.id,
                    name: action.locatie.name,
                    source: LocationType.CoordinatenRD,
                    geometry: new Point(action.locatie.coordinaten[ZoekLocatieSystem.RD]),
                    coordinaten: {
                      [ZoekLocatieSystem.RD]: action.locatie.coordinaten[ZoekLocatieSystem.RD],
                      system: ZoekLocatieSystem.RD,
                    },
                  },
                ],
              },
              commands: action.commands,
            });
          }),
          catchError(() =>
            of(
              FilterActions.LoadLocatieFilterError({
                error: {
                  name: 'Coördinaten',
                  message: 'De coördinaten kunnen niet gevonden worden',
                },
              })
            )
          )
        )
      )
    )
  );

  public searchWithCoordinatesETRS89$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.SearchWithCoordinates),
      filter(action => action.locatie?.coordinaten?.system === ZoekLocatieSystem.ETRS89),
      mergeMap(action =>
        this.searchLocationService.lookupRdNapTrans$(action.locatie.coordinaten[ZoekLocatieSystem.ETRS89]).pipe(
          map(response =>
            FilterActions.UpdateFilters({
              filterOptions: {
                [FilterName.LOCATIE]: [
                  {
                    id: action.locatie.id,
                    name: action.locatie.name,
                    source: LocationType.CoordinatenETRS89,
                    geometry: new Point(response),
                    coordinaten: {
                      [ZoekLocatieSystem.RD]: response,
                      [ZoekLocatieSystem.ETRS89]: action.locatie.coordinaten[ZoekLocatieSystem.ETRS89],
                      system: ZoekLocatieSystem.ETRS89,
                    },
                    noZoom: action.locatie.noZoom,
                  },
                ],
              },
              commands: action.commands,
            })
          ),
          catchError(e =>
            of(
              FilterActions.LoadLocatieFilterError({
                error: {
                  name: e.name === 'Buiten Nederland' ? e.name : 'Coördinaten',
                  message: e.name === 'Buiten Nederland' ? e.message : 'De coördinaten kunnen niet gevonden worden',
                },
              })
            )
          )
        )
      )
    )
  );

  public loadError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FilterActions.LoadLocatieFilterError),
        tap(action => {
          this.displayErrorInfoMessagesService.error({
            message: action.error.message,
            status: null,
            info: {
              API: 'PDOK locatie server',
              Status: 0,
              Melding: action.error.message,
              Tijdstip: new Date().toLocaleString(),
            },
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private pdokService: PdokService,
    private portaalSessionPutService: PortaalSessionPutService,
    private displayErrorInfoMessagesService: DisplayErrorInfoMessagesService,
    private searchLocationService: SearchLocationService,
    private fetchLocationInfoService: FetchLocationInfoService
  ) {}
}
