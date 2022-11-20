import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, filter, map } from 'rxjs/operators';
import * as PlannenActions from './plannen.actions';
import * as FilterActions from '~viewer/filter/+state/filter.actions';
import { FilterName } from '~viewer/filter/types/filter-options';

@Injectable()
export class PlannenEffects {
  public updateFilterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.UpdateFiltersSuccess),
      filter(action => !!action.filterOptions),
      map(() => PlannenActions.reset())
    )
  );

  public removeFilter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.RemoveFilter),
      map(() => PlannenActions.reset())
    )
  );

  public resetFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FilterActions.ResetFilters),
      filter(action =>
        [FilterName.DOCUMENT_TYPE, FilterName.REGELGEVING_TYPE, FilterName.REGELSBELEID, FilterName.LOCATIE].some(x =>
          action.filterNames.includes(x)
        )
      ),
      map(() => PlannenActions.reset())
    )
  );

  /*  Documenten lijst wordt leeggegooid en property wordt 'even' gezet
      om component opnieuw te laten renderen
  */
  public isDirty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.reset),
      delay(100),
      map(() => PlannenActions.setNotDirty())
    )
  );

  constructor(private actions$: Actions) {}
}
