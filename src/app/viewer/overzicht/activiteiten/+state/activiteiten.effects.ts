import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ActiviteitenActions from './activiteiten.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '~viewer/gebieds-info/+state';
import { getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { ActiviteitenService } from '~viewer/overzicht/services/activiteiten.service';
import { selectActiviteitenGroepen } from './activiteiten.selectors';

@Injectable()
export class ActiviteitenEffects {
  public loadActiviteiten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteitenActions.loadActiviteiten),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(selectActiviteitenGroepen)),
      filter(([_action, ozonLocaties, inStore]) => !!ozonLocaties.length && !inStore.length),
      map(() => ActiviteitenActions.loadingActiviteiten({ activiteiten: [] }))
    )
  );
  public loadingActiviteiten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ActiviteitenActions.loadingActiviteiten),
      withLatestFrom(this.store.select(getOzonLocaties)),
      concatMap(([action, ozonLocaties]) =>
        this.activiteitenService.getActiviteiten$(ozonLocaties, action.href).pipe(
          map(response => {
            if (response._links?.next?.href) {
              /* Laad meer */
              return ActiviteitenActions.loadingActiviteiten({
                activiteiten: action.activiteiten.concat(response._embedded.activiteiten),
                href: response._links.next.href,
              });
            } else {
              /* Klaar! */
              return ActiviteitenActions.loadActiviteitenSuccess({
                activiteiten: action.activiteiten.concat(response._embedded.activiteiten),
              });
            }
          }),
          catchError(error => of(ActiviteitenActions.loadActiviteitenFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private activiteitenService: ActiviteitenService,
    private store: Store<State>
  ) {}
}
