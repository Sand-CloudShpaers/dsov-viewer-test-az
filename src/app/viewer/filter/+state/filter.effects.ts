import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { RegelsbeleidKeys, RegelsbeleidType, RegelStatus, RegelStatusType } from '~model/regel-status.model';
import {
  FilterIdentification,
  FilterName,
  GebiedenFilter,
  LocatieFilter,
  RegelgevingtypeFilter,
} from '../types/filter-options';
import { LocationType } from '~model/internal/active-location-type.model';
import { reverseDateString } from '~general/utils/date.utils';
import { FilterUtils, RegelgevingInstructie } from '~general/utils/filter.utils';
import { LocationQueryParams, TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { NavigationService } from '~store/common/navigation/services/navigation.service';
import { State } from '~store/state';
import { PortaalSessionPutService } from '~portaal/portaal-session-put.service';
import { DocumentDto } from '~viewer/documenten/types/documentDto';
import { LocationInfoNavigationService } from '~viewer/kaart/services/location-info-navigation.service';
import { getFilterOptions } from './filter.selectors';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import * as SelectionActions from '~store/common/selection/+state/selection.actions';
import { ActiviteitVM } from '~viewer/gebieds-info/types/gebieds-info.model';
import { ZoekLocatieSystem } from '~model/internal/zoek-locatie-info';
import { setMaxDecimalsUsingFloor } from '~general/utils/math.utils';
import { MAX_DECIMALS_ETRS89, MAX_DECIMALS_RD } from '~general/utils/geo.utils';
import { GegevenscatalogusProvider } from '~providers/gegevenscatalogus.provider';
import { Documenttype } from '~model/gegevenscatalogus/documenttype';
import { getDatum, isLocationFilterComplete } from '../helpers/filters';
import WKT from 'ol/format/WKT';
import { Geometry } from 'ol/geom';

@Injectable()
export class FilterEffects {
  public resetFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.ResetFilters, FilterActions.ResetAllFilters, FilterActions.RemoveFilter),
      map(action => FilterActions.UpdateFiltersSuccess({ commands: action.commands }))
    )
  );

  public updateFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.UpdateFilters),
      filter(
        action => !action.filterOptions[FilterName.LOCATIE]?.length || isLocationFilterComplete(action.filterOptions)
      ),
      map(action =>
        FilterActions.UpdateFiltersSuccess({ filterOptions: action.filterOptions, commands: action.commands })
      )
    )
  );

  public resetSelections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.ResetAllFilters, FilterActions.RemoveFilter),
      map(() => SelectionActions.resetSelections({ excludeDocuments: false }))
    )
  );

  public updateFiltersSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FilterActions.UpdateFiltersSuccess),
        withLatestFrom(this.store.select(getFilterOptions)),
        map(([action, filterOptions]) => {
          let location: { [key: string]: string } = {};
          if (filterOptions.locatie?.length && filterOptions.locatie[0]?.name) {
            location = this.navigationService.getEmptyQueryParams(LocationQueryParams);
            if (
              filterOptions.locatie[0]?.source === LocationType.CoordinatenRD ||
              filterOptions.locatie[0]?.source === LocationType.CoordinatenETRS89
            ) {
              location = this.locationInfoNavigationService.getQueryParamsForCoordinates({
                coordinaten: filterOptions.locatie[0]?.coordinaten,
              });
            } else if (filterOptions.locatie[0]?.source === LocationType.Contour) {
              location = this.locationInfoNavigationService.getQueryParamsForContour(
                filterOptions.locatie[0]?.geometry
              );
            } else {
              location = this.locationInfoNavigationService.getQueryParamsForLocation(filterOptions.locatie[0]?.name);
            }
          }
          const queryParams: Params = {
            ...this.route.snapshot.queryParams,
            ...this.navigationService.getEmptyQueryParams(FilterName),
            instructieregelInstrument: null,
            instructieregelTaakuitoefening: null,
            ...location,
            regelsbeleid: filterOptions.regelsbeleid?.length ? filterOptions.regelsbeleid.map(x => x.id).join() : null,
            documenten: filterOptions.documenten?.length
              ? JSON.stringify(filterOptions.documenten.map(x => x.document))
              : null,
            document_type: filterOptions.document_type?.length
              ? filterOptions.document_type.map(x => x.id).join()
              : null,
            regelgeving_type: filterOptions.regelgeving_type?.length
              ? filterOptions.regelgeving_type.map(x => x.id).join()
              : null,
            activiteit: filterOptions.activiteit?.length
              ? JSON.stringify(filterOptions.activiteit.map(x => ({ id: x.id, name: x.name })))
              : null,
            gebieden: filterOptions.gebieden?.length
              ? JSON.stringify(
                  filterOptions.gebieden.map(x => ({
                    id: x.id,
                    name: x.name,
                    objectType: x.objectType,
                  }))
                )
              : null,
            thema: filterOptions.thema?.length
              ? JSON.stringify(filterOptions.thema.map(x => ({ id: x.id, name: x.name, group: x.group })))
              : null,
          };
          if (filterOptions[FilterName.DATUM]?.length) {
            queryParams[TimeTravelQueryParams.DATE] = filterOptions[FilterName.DATUM][0].timeTravelDate;
          }

          if (filterOptions[FilterName.ACTIVITEIT]?.length) {
            const activiteiten: ActiviteitVM[] = filterOptions[FilterName.ACTIVITEIT].map(item => ({
              identificatie: item.id,
              naam: item.name,
              groep: {
                code: null,
                waarde: item.group,
              },
              _links: null,
            }));
            this.portaalSessionPutService.sendActivitiesToPortal(activiteiten);
          }

          // Zet ook de regelgevingtypes met een geselecteerd item als queryparameter (instructieregelInstrument
          // en/of instructieregelTaakuitoefening)
          (filterOptions.regelgeving_type as RegelgevingtypeFilter[])
            ?.filter(r => r.items?.some(i => i.selected))
            .forEach(r => (queryParams[r.id] = r.items.filter(item => item.selected)[0].id));
          this.router.navigate(action.commands || [], { queryParamsHandling: 'merge', queryParams });
        })
      ),
    { dispatch: false }
  );

  public getFiltersFromQueryParams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.GetFiltersFromQueryParams),
      withLatestFrom(
        this.store.select(getFilterOptions),
        this.gegevenscatalogusProvider.getDocumenttypes$(),
        this.gegevenscatalogusProvider.getRegelgevingTypes$()
      ),
      filter(
        ([_action, filterOptions, _documentTypes, _regelgevingTyes]) =>
          // check of er al gevulde filters zijn, zo ja dan niet verder
          !Object.values(filterOptions).some(x => x.length)
      ),
      map(([action, _filterOptions, documentTypes, regelgevingTypes]) => {
        const queryParams = action.queryParams;
        return {
          locatie: this.getLocatieFilters(queryParams),
          documenten: queryParams[FilterName.DOCUMENTEN]
            ? (JSON.parse(queryParams[FilterName.DOCUMENTEN]) as DocumentDto[])
            : [],
          document_type: queryParams[FilterName.DOCUMENT_TYPE]
            ? this.getFilterIdentificationForDocumenttype(queryParams[FilterName.DOCUMENT_TYPE], documentTypes)
            : [],
          regelgeving_type: queryParams[FilterName.REGELGEVING_TYPE]
            ? this.getFilterIdentificationForRegelgevingtype(queryParams, regelgevingTypes)
            : [],
          activiteit: queryParams[FilterName.ACTIVITEIT]
            ? (JSON.parse(queryParams[FilterName.ACTIVITEIT]) as FilterIdentification[])
            : [],
          gebieden: queryParams[FilterName.GEBIEDEN]
            ? (JSON.parse(queryParams[FilterName.GEBIEDEN]) as GebiedenFilter[])
            : [],
          thema: queryParams[FilterName.THEMA]
            ? (JSON.parse(queryParams[FilterName.THEMA]) as FilterIdentification[])
            : [],
          regelsbeleid: queryParams[FilterName.REGELSBELEID]
            ? this.getRegelsEnBeleid(queryParams[FilterName.REGELSBELEID], queryParams[FilterName.DATUM])
            : [],
          datum: queryParams[FilterName.DATUM] !== undefined ? getDatum(queryParams[TimeTravelQueryParams.DATE]) : [],
        };
      }),
      map(filters =>
        FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: filters.locatie,
            [FilterName.ACTIVITEIT]: filters.activiteit,
            [FilterName.GEBIEDEN]: filters.gebieden,
            [FilterName.THEMA]: filters.thema,
            [FilterName.REGELGEVING_TYPE]: filters.regelgeving_type,
            [FilterName.DOCUMENT_TYPE]: filters.document_type,
            [FilterName.REGELSBELEID]: filters.regelsbeleid,
            [FilterName.DOCUMENTEN]: filters.documenten.map(x => ({
              id: x.documentId,
              name: 'document',
              document: x,
            })),
            [FilterName.DATUM]: filters.datum,
          },
        })
      )
    )
  );

  public setTimeTravelDateInFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.SetTimeTravelDate),
      withLatestFrom(this.store.select(getFilterOptions)),
      map(([action, filterOptions]) =>
        FilterActions.UpdateFilters({
          filterOptions: {
            [FilterName.LOCATIE]: action.timeTravelDate === '' ? [] : filterOptions.locatie,
            [FilterName.ACTIVITEIT]: [],
            [FilterName.GEBIEDEN]: [],
            [FilterName.THEMA]: [],
            [FilterName.REGELGEVING_TYPE]: filterOptions.regelgeving_type,
            [FilterName.DOCUMENT_TYPE]: filterOptions.document_type,
            [FilterName.REGELSBELEID]: this.getRegelsEnBeleid(
              filterOptions[FilterName.REGELSBELEID]
                .map(option => option.name)
                .toString()
                .toLowerCase(),
              action.timeTravelDate
            ),
            [FilterName.DOCUMENTEN]: [],
            [FilterName.DATUM]: [{ ...filterOptions[FilterName.DATUM][0], timeTravelDate: action.timeTravelDate }],
          },
        })
      )
    )
  );

  private getLocatieFilters(queryParams: Params): LocatieFilter[] {
    if (
      queryParams[LocationQueryParams.LOCATIE_X] &&
      queryParams[LocationQueryParams.LOCATIE_Y] &&
      queryParams[LocationQueryParams.LOCATIE_STELSEL]
    ) {
      return [this.getLocatieFilterFromCoordinates(queryParams)];
    }
    if (queryParams[LocationQueryParams.LOCATIE_GETEKEND_GEBIED]) {
      const geometry: Geometry = new WKT().readGeometry(queryParams[LocationQueryParams.LOCATIE_GETEKEND_GEBIED]);
      return [
        {
          id: 'getekend_gebied',
          name: 'Getekend gebied',
          geometry,
          contour: geometry,
          source: LocationType.Contour,
        },
      ];
    }
    if (queryParams[LocationQueryParams.LOCATIE]) {
      return [
        {
          id: queryParams[LocationQueryParams.LOCATIE],
          name: queryParams[LocationQueryParams.LOCATIE],
          geometry: null,
        },
      ];
    }
    return [];
  }

  private getLocatieFilterFromCoordinates(queryParams: Params): LocatieFilter {
    const coordinaten = {
      x: queryParams[LocationQueryParams.LOCATIE_X],
      y: queryParams[LocationQueryParams.LOCATIE_Y],
      system: queryParams[LocationQueryParams.LOCATIE_STELSEL],
      noZoom: queryParams[LocationQueryParams.NO_ZOOM] === 'true',
    };
    if ([ZoekLocatieSystem.RD, ZoekLocatieSystem.ETRS89].includes(coordinaten.system)) {
      // Forceer eventueel handmatig aangepaste x- en y-coördinaten naar een maximaal aantal decimalen
      if (coordinaten.system === ZoekLocatieSystem.ETRS89) {
        coordinaten.x = setMaxDecimalsUsingFloor(coordinaten.x, MAX_DECIMALS_ETRS89);
        coordinaten.y = setMaxDecimalsUsingFloor(coordinaten.y, MAX_DECIMALS_ETRS89);
      } else if (coordinaten.system === ZoekLocatieSystem.RD) {
        coordinaten.x = setMaxDecimalsUsingFloor(coordinaten.x, MAX_DECIMALS_RD);
        coordinaten.y = setMaxDecimalsUsingFloor(coordinaten.y, MAX_DECIMALS_RD);
      }
      return {
        id: coordinaten.system,
        name: `${coordinaten.x}, ${coordinaten.y}`,
        geometry: null,
        source:
          coordinaten.system === ZoekLocatieSystem.RD ? LocationType.CoordinatenRD : LocationType.CoordinatenETRS89,
        coordinaten: {
          [coordinaten.system]: [coordinaten.x, coordinaten.y],
          system: coordinaten.system,
        },
        noZoom: coordinaten.noZoom,
      };
    }
    return null;
  }

  private getRegelsEnBeleid = (values: string, timeTravelDate: string): FilterIdentification[] => {
    const filters: FilterIdentification[] = [];
    if (values.includes(RegelsbeleidKeys.Regels)) {
      filters.push(RegelsbeleidType.regels);
    }
    if (values.includes(RegelsbeleidKeys.Beleid)) {
      filters.push(RegelsbeleidType.beleid);
    }
    if (timeTravelDate) {
      const geldendFilter = RegelStatusType[RegelStatus.Geldend];
      geldendFilter.label = {
        name: `${reverseDateString(timeTravelDate)}`,
        removable: true,
      };
      filters.push(geldendFilter);
    }
    return filters;
  };

  private getFilterIdentificationForDocumenttype = (values: string, types: Documenttype[]): FilterIdentification[] => {
    const filters: FilterIdentification[] = [];
    values.split(',').forEach(id => {
      const found = types.find(type => type.id === id);
      if (found) {
        filters.push(found);
      }
    });
    return filters;
  };

  private getFilterIdentificationForRegelgevingtype = (
    queryParams: Params,
    regelgevingTypes: RegelgevingtypeFilter[]
  ): FilterIdentification[] => {
    const regelgevingtype = queryParams[FilterName.REGELGEVING_TYPE];
    const instrument = queryParams[RegelgevingInstructie.INSTRUMENT];
    const taakuitoefening = queryParams[RegelgevingInstructie.TAAKUITOEFENING];
    const filters: FilterIdentification[] = [];
    regelgevingtype.split(',').forEach((id: string) => {
      const found = regelgevingTypes.find(type => type.id === id);
      if (found) {
        if (found.id === RegelgevingInstructie.INSTRUMENT && instrument) {
          found.items = found.items.map(item => ({ ...item, selected: item.id === instrument }));
        } else if (found.id === RegelgevingInstructie.TAAKUITOEFENING && taakuitoefening) {
          found.items = found.items.map(item => ({ ...item, selected: item.id === taakuitoefening }));
        }
        filters.push({
          ...found,
          name: FilterUtils.getNameForRegelgevingType(found),
        });
      }
    });
    return filters;
  };

  constructor(
    private actions$: Actions,
    private gegevenscatalogusProvider: GegevenscatalogusProvider,
    private locationInfoNavigationService: LocationInfoNavigationService,
    private navigationService: NavigationService,
    private portaalSessionPutService: PortaalSessionPutService,
    private store: Store<State>,
    private route: ActivatedRoute,
    private router: Router
  ) {}
}
