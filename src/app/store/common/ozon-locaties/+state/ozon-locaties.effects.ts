import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { LocatieZoekgebieden } from '~ozon-model/locatieZoekgebieden';
import { OntwerpLocatieZoekgebieden } from '~ozon-model/ontwerpLocatieZoekgebieden';
import { OzonProvider } from '~providers/ozon.provider';
import * as OzonLocatiesActions from './ozon-locaties.actions';
import { State } from '~store/state';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { FilterName } from '~viewer/filter/types/filter-options';
import { isLocationFilterComplete } from '~viewer/filter/helpers/filters';
import { getFilterOptions } from '~viewer/filter/+state/filter.selectors';
import { getOzonLocaties } from './ozon-locaties.selectors';

@Injectable()
export class OzonLocatiesEffects {
  // altijd ozonlocaties herladen bij een updateFiltersSuccess
  // Bij een refresh en tijdreizen is op de query-parameter datum nog niet aanwezig in de url
  // In dit geval halen we de datum uit de store en geven we die door via de action aan het
  // loadOzonLocaties$
  public updateFiltersSuccess$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.UpdateFiltersSuccess),
      withLatestFrom(this.store.select(getFilterOptions), this.store.select(getOzonLocaties)),
      filter(([_action, filterOptions, fromStore]) => isLocationFilterComplete(filterOptions) && !fromStore.length),
      map(([_action, filterOptions]) =>
        OzonLocatiesActions.loading({
          activeLocation: filterOptions[FilterName.LOCATIE][0],
          timeTravelDate:
            filterOptions[FilterName.DATUM]?.length && filterOptions[FilterName.DATUM][0].timeTravelDate
              ? filterOptions[FilterName.DATUM][0].timeTravelDate
              : null,
        })
      )
    )
  );

  public loadOzonLocaties$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(OzonLocatiesActions.loading),
      mergeMap(action =>
        this.ozonProvider.fetchOzonLocatiesByGeo$(action.activeLocation, { geldigOp: action.timeTravelDate }).pipe(
          map((data: [LocatieZoekgebieden, OntwerpLocatieZoekgebieden]) =>
            OzonLocatiesActions.loadSuccess({
              locatieIds: data[0]._embedded.locatieidentificaties,
              omgevingsplanPons: data[0]._embedded.omgevingsplanPons,
              ontwerpLocatieTechnischIds: data[1]?._embedded?.technischIds,
            })
          ),
          catchError(error => of(OzonLocatiesActions.loadError({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private ozonProvider: OzonProvider, private store: Store<State>) {}
}
