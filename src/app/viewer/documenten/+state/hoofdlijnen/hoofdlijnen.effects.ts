import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as HoofdlijnenActions from './hoofdlijnen.actions';
import { OmgevingsDocumentService } from '../../services/omgevings-document.service';
import { HoofdlijnZoekParameter } from '~ozon-model/hoofdlijnZoekParameter';
import { OntwerpHoofdlijnZoekParameter } from '~ozon-model/ontwerpHoofdlijnZoekParameter';
import { ApiUtils } from '~general/utils/api.utils';

@Injectable()
export class HoofdlijnenEffects {
  public loadDocumentHoofdlijnen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HoofdlijnenActions.loadHoofdlijnen),
      map(action =>
        HoofdlijnenActions.loadingHoofdlijnen({
          document: action.document,
        })
      )
    )
  );

  public loadingDocumentHoofdlijnen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HoofdlijnenActions.loadingHoofdlijnen),
      mergeMap(action => {
        const vastgesteld$ = this.omgevingsDocumentService.getDocumentHoofdlijnen$([
          {
            parameter: HoofdlijnZoekParameter.ParameterEnum.DocumentIdentificatie,
            zoekWaarden: [action.document.documentId],
          },
        ]);
        const ontwerp$ = ApiUtils.isOntwerpRegeling(action.document.documentId)
          ? this.omgevingsDocumentService.getOntwerpDocumentHoofdlijnen$([
              {
                parameter: OntwerpHoofdlijnZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
                zoekWaarden: [action.document.documentId],
              },
            ])
          : of(null);
        return forkJoin([vastgesteld$, ontwerp$]).pipe(
          map(response =>
            HoofdlijnenActions.loadHoofdlijnenSuccess({
              documentId: action.document.documentId,
              vastgesteld: response[0],
              ontwerp: response[1],
            })
          ),
          catchError(error =>
            of(HoofdlijnenActions.loadHoofdlijnenFailure({ documentId: action.document.documentId, error }))
          )
        );
      })
    )
  );

  constructor(private actions$: Actions, private omgevingsDocumentService: OmgevingsDocumentService) {}
}
