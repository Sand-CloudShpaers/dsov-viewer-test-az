import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as OmgevingswaardenActions from './omgevingswaarden.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '~store/common';
import { getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';

@Injectable()
export class OmgevingswaardenEffects {
  public loadOmgevingswaarden$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OmgevingswaardenActions.loadOmgevingswaarden),
      withLatestFrom(this.store.select(getOzonLocaties)),
      filter(([_action, ozonLocaties]) => !!ozonLocaties.length),
      concatMap(([action, ozonLocaties]) =>
        this.gebiedsInfoService.getOmgevingswaarden$(ozonLocaties, action.href).pipe(
          map(response => {
            if (response._links?.next?.href) {
              /* Laad meer */
              return OmgevingswaardenActions.loadOmgevingswaarden({
                omgevingswaarden: action.omgevingswaarden.concat(response._embedded.omgevingswaarden),
                href: response._links.next.href,
              });
            } else {
              /* Klaar! */
              return OmgevingswaardenActions.loadOmgevingswaardenSuccess({
                omgevingswaarden: action.omgevingswaarden.concat(response._embedded.omgevingswaarden),
              });
            }
          }),
          // OmgevingswaardenActions.loadOmgevingswaardenSuccess({ omgevingswaarden })),
          catchError(error => of(OmgevingswaardenActions.loadOmgevingswaardenFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private gebiedsInfoService: GebiedsInfoService, private store: Store<State>) {}
}
