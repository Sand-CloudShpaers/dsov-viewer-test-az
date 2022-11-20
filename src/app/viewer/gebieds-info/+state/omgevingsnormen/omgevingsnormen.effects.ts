import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { State } from '~viewer/gebieds-info/+state';
import { getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { getActiveLocationIsLargeArea } from '~viewer/filter/+state/filter.selectors';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';
import * as OmgevingsnormenActions from './omgevingsnormen.actions';
import * as fromOmgevingsnormen from './omgevingsnormen.selectors';

@Injectable()
export class OmgevingsnormenEffects {
  public loadOmgevingsnormen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OmgevingsnormenActions.loadOmgevingsnormen),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(fromOmgevingsnormen.getOmgevingsnormen),
        this.store.select(getActiveLocationIsLargeArea)
      ),
      filter(
        ([_action, ozonLocaties, fromStore, isLargeArea]) => !!ozonLocaties.length && !fromStore?.length && !isLargeArea
      ),
      map(([action]) => OmgevingsnormenActions.loadingOmgevingsnormen(action))
    )
  );

  public loadingOmgevingsnormen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OmgevingsnormenActions.loadingOmgevingsnormen),
      withLatestFrom(this.store.select(getOzonLocaties)),
      concatMap(([action, ozonLocaties]) =>
        this.gebiedsInfoService.getOmgevingsnormen$(ozonLocaties, action.href).pipe(
          map(response => {
            if (response._links?.next?.href) {
              /* Laad meer */
              return OmgevingsnormenActions.loadOmgevingsnormen({
                omgevingsnormen: action.omgevingsnormen.concat(response._embedded.omgevingsnormen),
                href: response._links.next.href,
              });
            } else {
              /* Klaar! */
              return OmgevingsnormenActions.loadOmgevingsnormenSuccess({
                omgevingsnormen: action.omgevingsnormen.concat(response._embedded.omgevingsnormen),
              });
            }
          }),
          catchError(error => of(OmgevingsnormenActions.loadOmgevingsnormenFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private gebiedsInfoService: GebiedsInfoService, private store: Store<State>) {}
}
