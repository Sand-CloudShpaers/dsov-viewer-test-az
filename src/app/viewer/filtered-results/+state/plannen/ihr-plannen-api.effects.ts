import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { State } from '~viewer/filtered-results/+state';
import { IhrPlannenService } from '~viewer/filtered-results/services/ihr-plannen.service';
import * as PlannenActions from './plannen.actions';
import { getOmgevingsplanPons, getOzonLocaties } from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { getFilterOptions, getFilterOptionsForLocatie } from '~viewer/filter/+state/filter.selectors';
import { Bestuurslaag } from '~viewer/documenten/types/documenten.model';
import { getInStore } from '~viewer/filtered-results/+state/plannen.selectors';
import { FilterName } from '~viewer/filter/types/filter-options';

@Injectable()
export class IhrPlannenApiEffects {
  public loadOnNavigationGemeente$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.load),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getInStore)),
      filter(([_action, ozonLocaties, inStore]) => ozonLocaties.length > 0 && !inStore),
      map(() => PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.GEMEENTE }))
    )
  );
  public loadOnNavigationProvincie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.load),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getInStore)),
      filter(([_action, ozonLocaties, inStore]) => ozonLocaties.length > 0 && !inStore),
      map(() => PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.PROVINCIE }))
    )
  );
  public loadOnNavigationRijk$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.load),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getInStore)),
      filter(([_action, ozonLocaties, inStore]) => ozonLocaties.length > 0 && !inStore),
      map(() => PlannenActions.ihrLoading({ bestuurslaag: Bestuurslaag.RIJK }))
    )
  );

  public loadIhr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ihrLoading),
      withLatestFrom(this.store.select(getFilterOptions), this.store.select(getOmgevingsplanPons)),
      concatMap(([action, filterOptions, ponsOmgevingsplan]) =>
        this.ihrService.loadDocsByGeometry$(filterOptions, ponsOmgevingsplan, action.bestuurslaag).pipe(
          map(ihrPlannen => PlannenActions.ihrLoadSuccess({ ihrPlannen, bestuurslaag: action.bestuurslaag })),
          catchError(error => of(PlannenActions.ihrLoadError({ error, bestuurslaag: action.bestuurslaag })))
        )
      )
    )
  );

  public loadMoreIhr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ihrLoadMore),
      withLatestFrom(this.store.select(getFilterOptionsForLocatie)),
      concatMap(([{ bestuurslaag, href }, filterOptionsForLocatie]) =>
        this.ihrService.loadMorePlannen$(href, filterOptionsForLocatie[FilterName.LOCATIE][0], bestuurslaag).pipe(
          map(ihrPlannen => PlannenActions.ihrLoadMoreSuccess({ ihrPlannen, bestuurslaag })),
          catchError(error => of(PlannenActions.ihrLoadError({ error, bestuurslaag })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private ihrService: IhrPlannenService, private store: Store<State>) {}
}
