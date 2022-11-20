import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as MapDetailsActions from './map-details.actions';
import { IhrProvider } from '~providers/ihr.provider';

@Injectable()
export class MapDetailsEffects {
  public load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MapDetailsActions.load),
      map(action => ({
        ...action,
        objectIds: action.features?.map(x => x.getProperties().objectid).filter(x => x?.length),
      })),
      mergeMap(action =>
        this.ihrProvider.fetchCartografieSummaries$(action.documentId, action.objectIds).pipe(
          map(cartografie =>
            MapDetailsActions.loadSuccess({
              cartografie,
              documentId: action.documentId,
            })
          ),
          catchError(error =>
            of(
              MapDetailsActions.loadFailure({
                documentId: action.documentId,
                error,
              })
            )
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private ihrProvider: IhrProvider) {}
}
