import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import * as DocumentLocatieActions from './document-locatie.actions';
import { getExtent } from './document-locatie.selectors';
import { OzonProvider } from '~providers/ozon.provider';

@Injectable()
export class DocumentLocatieEffects {
  public load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentLocatieActions.load),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.select(getExtent(action.documentId))))),
      filter(([_action, inStore]) => !inStore),
      map(([action, _inStore]) =>
        DocumentLocatieActions.loading({
          href: action.href,
          documentId: action.documentId,
        })
      )
    )
  );

  public loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentLocatieActions.loading),
      concatMap(action =>
        this.ozonProvider.fetchLocatieMetBoundingBox$(action.href).pipe(
          map(response =>
            DocumentLocatieActions.loadingSuccess({
              documentId: action.documentId,
              locatie: response,
            })
          ),
          catchError(error => of(DocumentLocatieActions.loadingFailure({ documentId: action.documentId, error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private store: Store<State>, private ozonProvider: OzonProvider) {}
}
