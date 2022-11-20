import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '~store/common';
import * as KaartenImroActions from '~viewer/documenten/+state/kaarten-imro/kaarten-imro.actions';

import { ImroPlanVtService } from '~viewer/documenten/services/imro-plan-vt.service';

@Injectable()
export class KaartenImroEffects {
  public loadingStyleConfigs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KaartenImroActions.loadStyleConfigs),
      mergeMap(action =>
        forkJoin(
          action.documentIds.map(documentId => this.imroPlanVtService.getImroPlanStyleConfigs$(documentId))
        ).pipe(
          map(configs => KaartenImroActions.loadStyleConfigsSuccess({ configs })),
          catchError(error =>
            of(KaartenImroActions.loadStyleConfigsFailure({ documentIds: action.documentIds, error }))
          )
        )
      )
    )
  );

  public loadStyles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KaartenImroActions.loadStyleConfigsSuccess),
      mergeMap(action => {
        const styleConfigs = action.configs.map(config => config.styles).flat();
        return forkJoin(styleConfigs.map(style => this.imroPlanVtService.getStyle$(style.url))).pipe(
          // voor vormvrije plannen heeft de style een naam die gelijk is aan de naam in de configuratie
          // voor bestemmingsplannen is de naam van de style leeg, de eerste met een name === '' kan gebruikt
          // worden omdat de style van bestemmingsplannen altijd gelijk is.
          map(responses => {
            const result = action.configs.map(config => ({
              ...config,
              styles: config.styles.map(style => ({
                ...style,
                style: responses.find(r => r.name === style.naam)
                  ? responses.find(r => r.name === style.naam)
                  : responses.find(r => r.name === ''),
              })),
            }));
            return KaartenImroActions.loadStylesSuccess({ configs: result });
          }),
          catchError(error => of(KaartenImroActions.loadStylesFailure({ documentIds: [], error })))
        );
      })
    )
  );

  constructor(private actions$: Actions, private store: Store<State>, private imroPlanVtService: ImroPlanVtService) {}
}
