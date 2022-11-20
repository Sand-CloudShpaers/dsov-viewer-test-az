import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { uniqueObjects } from '~general/utils/array.utils';
import {
  getOzonLocaties,
  getOzonOntwerpLocatieTechnischIds,
} from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { State } from '~viewer/filtered-results/+state';
import { OzonDocumentenService } from '~viewer/filtered-results/services/ozon-documenten.service';
import * as PlannenActions from './plannen.actions';
import { FilterIdentification } from '~viewer/filter/types/filter-options';
import { RegelStatus } from '~model/regel-status.model';
import * as FetchDocumentsTriggerUpdatedFiltersActions from '~store/actions/document/fetch-documents-trigger.actions';
import { getFilterOptions } from '~viewer/filter/+state/filter.selectors';
import { getInStore } from '../plannen.selectors';
import { LOCATIE_ID_TYPE } from '~general/utils/filter.utils';

@Injectable()
export class OzonRegelingenApiEffects {
  public conditionalLoadVastgesteld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.load, FetchDocumentsTriggerUpdatedFiltersActions.trigger),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(getFilterOptions),
        this.store.select(getInStore)
      ),
      filter(([_action, ozonLocaties, filterOptions, inStore]) => {
        const regelsBeleidfilterOptions: FilterIdentification[] = filterOptions['regelsbeleid'];
        const getVastgesteld = !!regelsBeleidfilterOptions.filter(
          f => f.group === 'regelStatus' && f.id === RegelStatus.Geldend
        ).length;
        const getOntwerp = !!regelsBeleidfilterOptions.filter(
          f => f.group === 'regelStatus' && f.id === RegelStatus.InVoorbereiding
        ).length;

        return ozonLocaties.length && !inStore && (getVastgesteld || (!getVastgesteld && !getOntwerp));
      }),
      map(() => PlannenActions.ozonLoading({ loadMore: true }))
    )
  );

  public conditionalLoadOntwerp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.load, FetchDocumentsTriggerUpdatedFiltersActions.trigger),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(getFilterOptions),
        this.store.select(getInStore)
      ),
      filter(([_action, ozonLocaties, filterOptions, inStore]) => {
        const regelsBeleidfilterOptions: FilterIdentification[] = filterOptions['regelsbeleid'];
        const getVastgesteld = !!regelsBeleidfilterOptions.filter(
          f => f.group === 'regelStatus' && f.id === RegelStatus.Geldend
        ).length;
        const getOntwerp = !!regelsBeleidfilterOptions.filter(
          f => f.group === 'regelStatus' && f.id === RegelStatus.InVoorbereiding
        ).length;
        return ozonLocaties.length && !inStore && (getOntwerp || (!getVastgesteld && !getOntwerp));
      }),
      map(() => PlannenActions.ozonOntwerpLoading({ loadMore: true }))
    )
  );

  public loadOzonVastgesteld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ozonLoading),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getFilterOptions)),
      concatMap(([action, ozonLocaties, filterOptions]) =>
        this.ozonService.loadOzonDocumenten$(ozonLocaties, filterOptions, action.loadMore).pipe(
          map(response =>
            PlannenActions.ozonLoadSuccess({
              regelingen: response[0].concat(response[1]),
              omgevingsvergunningen: response[2],
            })
          ),
          catchError(error => of(PlannenActions.ozonLoadError({ error })))
        )
      )
    )
  );

  public loadOzonOntwerp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ozonOntwerpLoading),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(getOzonOntwerpLocatieTechnischIds),
        this.store.select(getFilterOptions)
      ),
      concatMap(([action, ozonLocatieIds, ontwerpLocatieTechnischIds, filterOptions]) =>
        forkJoin([
          this.ozonService.loadOzonOntwerpDocumenten$(
            LOCATIE_ID_TYPE.locatieIdentificatie,
            ozonLocatieIds,
            filterOptions,
            action.loadMore
          ),
          this.ozonService.loadOzonOntwerpDocumenten$(
            LOCATIE_ID_TYPE.OntwerplocatieTechnischId,
            ontwerpLocatieTechnischIds,
            filterOptions,
            action.loadMore
          ),
        ]).pipe(
          map(response =>
            /* In theorie kan een zelfde ontwerpregeling op basis van zoekparameter 'locatie.identificatie'
                 en 'ontwerplocatie.technischId' geretourneerd worden: daarom wordt er hier via uniqueObjects
                 voor gezorgd dat de resulterende array unieke ontwerpRegelingen bevat op basis van technischId */
            uniqueObjects(
              response[0][0]
                .concat(response[0][1])
                .concat(response[1][0])
                .concat(response[1][1])
                .map(ontwerpRegeling => ontwerpRegeling),
              'technischId'
            )
          ),
          map(ontwerpRegelingen =>
            PlannenActions.ozonOntwerpLoadSuccess({
              ontwerpRegelingen,
            })
          ),
          catchError(error => of(PlannenActions.ozonOntwerpLoadError({ error })))
        )
      )
    )
  );

  public loadMoreOzon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ozonLoadMore),
      concatMap(({ fetchUrl, ozonLocaties, filterOptions }) =>
        this.ozonService.loadMore$(fetchUrl, ozonLocaties, filterOptions).pipe(
          map(regelingen => PlannenActions.ozonLoadMoreSuccess({ regelingen })),
          catchError(error => of(PlannenActions.ozonLoadError({ error })))
        )
      )
    )
  );

  public loadMoreOzonOntwerp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ozonOntwerpLoadMore),
      concatMap(({ fetchUrl, locatieIdType, locatieIds, filterOptions }) =>
        this.ozonService.loadMoreOntwerp$(fetchUrl, locatieIdType, locatieIds, filterOptions).pipe(
          map(ontwerpRegelingen => PlannenActions.ozonOntwerpLoadMoreSuccess({ ontwerpRegelingen })),
          catchError(error => of(PlannenActions.ozonOntwerpLoadError({ error })))
        )
      )
    )
  );

  public loadMoreOzonOmgevingsvergunning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlannenActions.ozonOmgevingsvergunningLoadMore),
      concatMap(({ fetchUrl, ozonLocaties, filterOptions }) =>
        this.ozonService.loadMoreOmgevingsvergunningen$(fetchUrl, ozonLocaties, filterOptions).pipe(
          map(omgevingsvergunningen =>
            PlannenActions.ozonOmgevingsvergunningLoadMoreSuccess({ omgevingsvergunningen })
          ),
          catchError(error => of(PlannenActions.ozonLoadError({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private ozonService: OzonDocumentenService, public store: Store<State>) {}
}
