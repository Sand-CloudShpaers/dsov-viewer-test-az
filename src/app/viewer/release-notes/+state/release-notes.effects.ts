import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';
import * as ReleaseNotesActions from './release-notes.actions';
import { ReleaseNotesService } from '../services/release-notes.service';
import { select, Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import * as fromReleaseNotes from '~viewer/release-notes/+state/release-notes.selectors';
import { releaseNotesEntityId } from '~viewer/release-notes/+state/release-notes.reducer';

@Injectable()
export class ReleaseNotesEffects {
  public getReleaseNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReleaseNotesActions.getReleaseNotes),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromReleaseNotes.getReleaseNotesVM(releaseNotesEntityId))))
        )
      ),
      map(([_action, releaseNotes]) => {
        if (releaseNotes) {
          return ReleaseNotesActions.loadReleaseNotesSuccess({ releaseNotes });
        } else {
          return ReleaseNotesActions.loadReleaseNotes();
        }
      })
    )
  );

  public loadReleaseNotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReleaseNotesActions.loadReleaseNotes),
      concatMap(() =>
        this.releaseNotesService.getReleaseNotes$().pipe(
          map(releaseNotes => ReleaseNotesActions.loadReleaseNotesSuccess({ releaseNotes })),
          catchError(error => of(ReleaseNotesActions.loadReleaseNotesFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private releaseNotesService: ReleaseNotesService,
    private store: Store<State>
  ) {}
}
