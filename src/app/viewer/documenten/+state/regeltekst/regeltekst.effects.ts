import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { State } from '../index';
import * as RegeltekstActions from './regeltekst.actions';
import * as fromRegeltekst from './regeltekst.selectors';

@Injectable()
export class RegeltekstEffects {
  public shouldLoadRegeltekst$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegeltekstActions.openedRegeltekstForElement),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(
              fromRegeltekst.selectRegeltekstByDocumentIdAndElementId(
                action.documentId,
                action.documentstructuurelementId
              )
            )
          )
        )
      ),
      filter(([_action, entity]) => !entity),
      map(([action, _structuurRegelteksten]) =>
        RegeltekstActions.loadRegeltekst({
          documentstructuurelementId: action.documentstructuurelementId,
          regeltekstHref: action.regeltekstHref,
          isOntwerp: action.isOntwerp,
        })
      )
    )
  );

  constructor(private actions$: Actions, private store: Store<State>) {}
}
