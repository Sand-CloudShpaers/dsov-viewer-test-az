import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import * as ThemaActions from './themas.actions';
import * as fromThemas from './themas.selectors';
import * as fromDocumenten from '~viewer/documenten/+state/documenten/documenten.selectors';
import { OmgevingsDocumentService } from '../../services/omgevings-document.service';
import { Store } from '@ngrx/store';
import { State } from '../index';
import { Themas } from '~ozon-model/themas';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';

@Injectable()
export class ThemasEffects {
  public loadThemas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemaActions.load),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromThemas.selectThemasByDocumentId(action.document.documentId)))
        )
      ),
      filter(([_action, themas]) => !themas?.length),
      map(([action, _themas]) =>
        ThemaActions.loading({
          document: action.document,
        })
      )
    )
  );

  public loadingThemas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemaActions.loading),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromDocumenten.selectDocumentById(action.document.documentId)))
        )
      ),
      filter(([_action, document]) => !!document?.data?.ozon),
      mergeMap(([action, document]) =>
        this.omgevingsDocumentService
          .get$<Themas>((document.data.ozon as Regeling | OntwerpRegeling)._links.themas?.href)
          .pipe(
            map(themasResponse =>
              ThemaActions.loadSuccess({
                document: action.document,
                themas: themasResponse,
              })
            ),
            catchError(error => of(ThemaActions.loadFailure({ document: action.document, error })))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private omgevingsDocumentService: OmgevingsDocumentService,
    private store: Store<State>
  ) {}
}
