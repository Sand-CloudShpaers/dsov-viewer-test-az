import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '~store/common';
import { catchError, concatMap, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { OzonProvider } from '~providers/ozon.provider';
import { of } from 'rxjs';
import * as HighlightActions from './highlight.actions';
import { HighlightService } from '~viewer/kaart/services/highlight.service';
import { ApiSource } from '~model/internal/api-source';
import { getCurrent, getHighlightById, selectHighlights } from './highlight.selectors';
import { getTimeTravelFilter } from '~viewer/filter/+state/filter.selectors';

@Injectable()
export class HighlightEffects {
  public load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HighlightActions.load),
      withLatestFrom(this.store.select(selectHighlights)),
      filter(([action, highlights]) => !highlights.some(x => x.id === action.id)),
      map(([action, _highlights]) => HighlightActions.loading(action))
    )
  );

  public show$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HighlightActions.load, HighlightActions.loadingSuccess),
        concatMap(action =>
          of(action).pipe(
            withLatestFrom(
              this.store.select(getHighlightById(action.id)),
              this.store.select(getCurrent),
              this.store.select(getTimeTravelFilter)
            )
          )
        ),
        filter(
          ([action, highlight, current, _timeTravelFilter]) =>
            (!!highlight?.selections?.length || !!highlight?.verbeelding) && current === action.id
        ),
        tap(([action, highlight, _current, timeTravelFilter]) => {
          if (action.apiSource === ApiSource.OZON) {
            this.highlightService.addHighlightLayerOzon(highlight.verbeelding, !!timeTravelFilter);
          } else if (action.apiSource === ApiSource.IHR) {
            // Haal één documentId uit de selections
            const documentIds = action.selections.map(x => x.documentDto?.documentId);
            const locatieIds = action.selections.map(x => x.locatieIds).flat();
            this.highlightService.addHighlightLayerIHR(documentIds[0], locatieIds);
          }
        })
      ),
    { dispatch: false }
  );

  public ozonLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HighlightActions.loading),
      filter(action => action.apiSource === ApiSource.OZON),
      mergeMap(action =>
        this.ozonProvider.fetchVerbeelding$(action.selections).pipe(
          map(response =>
            HighlightActions.loadingSuccess({
              ...action,
              verbeelding: response,
            })
          ),
          catchError(error => of(HighlightActions.loadingFailure({ id: action.id, error })))
        )
      )
    )
  );

  public ihrLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HighlightActions.loading),
      filter(action => action.apiSource === ApiSource.IHR),
      map(action => HighlightActions.loadingSuccess(action))
    )
  );

  public cancel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(HighlightActions.cancel),
        tap(() => {
          this.highlightService.removeHighlightLayer();
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private highlightService: HighlightService,
    private ozonProvider: OzonProvider
  ) {}
}
