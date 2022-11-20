import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import { OmgevingsDocumentService } from '../../services/omgevings-document.service';
import * as fromKaarten from './kaarten.selectors';
import * as KaartenActions from './kaarten.actions';
import { KaartZoekParameter } from '~ozon-model/kaartZoekParameter';

@Injectable()
export class KaartenEffects {
  public checkLoadKaarten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KaartenActions.checkLoadKaarten),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromKaarten.selectKaartenStatusByDocumentId(action.documentId)))
        )
      ),
      filter(([_action, status]) => !status.isResolved),
      map(([action, _status]) =>
        KaartenActions.loadKaarten({
          zoekParameters: [
            {
              parameter: KaartZoekParameter.ParameterEnum.DocumentIdentificatie,
              zoekWaarden: [action.documentId],
            },
          ],
          documentId: action.documentId,
          kaarten: [],
        })
      )
    )
  );

  public loadKaarten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(KaartenActions.loadKaarten),
      mergeMap(action =>
        this.omgevingsDocumentService.getDocumentKaarten$(action.zoekParameters, action.href).pipe(
          map(response => {
            if (response._links?.next?.href) {
              /* Laad meer */
              return KaartenActions.loadKaarten({
                ...action,
                kaarten: action.kaarten.concat(response._embedded.kaarten),
                href: response._links.next.href,
              });
            } else {
              /* Klaar! */
              return KaartenActions.loadKaartenSuccess({
                kaarten: action.kaarten.concat(response._embedded.kaarten),
                documentId: action.documentId,
              });
            }
          }),
          catchError(error => of(KaartenActions.loadKaartenFailure({ documentId: action.documentId, error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private omgevingsDocumentService: OmgevingsDocumentService
  ) {}
}
