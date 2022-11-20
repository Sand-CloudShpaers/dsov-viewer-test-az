import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '../index';
import { getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';
import * as GebiedsaanwijzingenActions from '~viewer/gebieds-info/+state/gebiedsaanwijzingen/gebiedsaanwijzingen.actions';
import { mergeObjectOrArray } from '~general/utils/lodash.utils';

@Injectable()
export class GebiedsaanwijzingenEffects {
  public loadGebiedsaanwijzingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GebiedsaanwijzingenActions.loadGebiedsaanwijzingen),
      withLatestFrom(this.store.select(getOzonLocaties)),
      filter(([_action, ozonLocaties]) => !!ozonLocaties.length),
      concatMap(([action, ozonLocaties]) =>
        this.gebiedsInfoService.getGebiedsaanwijzingen$(ozonLocaties, action.href).pipe(
          map(response => {
            if (response._links?.next?.href) {
              /* Laad meer */
              return GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({
                gebiedsaanwijzingen: mergeObjectOrArray(action.gebiedsaanwijzingen, response._embedded),
                href: response._links.next.href,
              });
            } else {
              /* Klaar! */
              return GebiedsaanwijzingenActions.loadGebiedsaanwijzingenSuccess({
                gebiedsaanwijzingen: mergeObjectOrArray(action.gebiedsaanwijzingen, response._embedded),
              });
            }
          }),
          catchError(error => of(GebiedsaanwijzingenActions.loadGebiedsaanwijzingenFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private gebiedsInfoService: GebiedsInfoService, private store: Store<State>) {}
}
