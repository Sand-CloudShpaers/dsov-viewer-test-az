import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import * as ApplicationInfoActions from './application-info.actions';
import { State } from '~store/common';
import { OzonProvider } from '~providers/ozon.provider';
import { forkJoin, of } from 'rxjs';
import { selectApplicationInfo } from './application-info.selectors';
import { IhrProvider } from '~providers/ihr.provider';

@Injectable()
export class ApplicationInfoEffects {
  public load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationInfoActions.load),
      withLatestFrom(this.store.select(selectApplicationInfo)),
      filter(([_action, inStore]) => !inStore),
      map(() => ApplicationInfoActions.loading())
    )
  );

  public loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ApplicationInfoActions.loading),
      concatMap(() =>
        forkJoin([
          this.ozonProvider.fetchPresenterenInfo$(),
          this.ozonProvider.fetchVerbeeldenInfo$(),
          this.ihrProvider.fetchAppInfo$(),
        ]).pipe(
          map(response =>
            ApplicationInfoActions.loadSuccess({
              ozonPresenteren: response[0],
              ozonVerbeelden: response[1],
              ihr: response[2],
            })
          ),
          catchError(error => of(ApplicationInfoActions.loadFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private ozonProvider: OzonProvider,
    private ihrProvider: IhrProvider
  ) {}
}
