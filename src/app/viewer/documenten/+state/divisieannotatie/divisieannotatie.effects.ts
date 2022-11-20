import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import * as DivisieannotatieActions from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.actions';
import { Store } from '@ngrx/store';
import * as fromDivisieannotatieannotatie from '~viewer/documenten/+state/divisieannotatie/divisieannotatie.selectors';
import { State } from '~viewer/documenten/+state';

@Injectable()
export class DivisieannotatieEffects {
  public shouldLoadDivisieannotatieForElement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisieannotatieActions.openedDivisieannotatieForElement),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(
              fromDivisieannotatieannotatie.selectDivisieannotatieByDocumentIdAndElementId(
                action.documentId,
                action.documentstructuurelementId
              )
            )
          )
        )
      ),
      filter(([_action, entity]) => !entity),
      map(([action, _entity]) =>
        DivisieannotatieActions.loadDivisieannotatie({
          documentstructuurelementId: action.documentstructuurelementId,
          href: action.href,
          isOntwerp: action.isOntwerp,
        })
      )
    )
  );

  constructor(private actions$: Actions, private store: Store<State>) {}
}
