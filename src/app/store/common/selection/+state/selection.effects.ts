import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '~store/common';
import { catchError, delay, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { OzonProvider } from '~providers/ozon.provider';
import * as SelectionActions from '~store/common/selection/+state/selection.actions';
import { OmgevingsdocumentlagenService } from '~viewer/kaart/services/omgevingsdocumentlagen.service';
import * as fromSelections from '~store/common/selection/+state/selection.selectors';
import * as PlannenActions from '~viewer/filtered-results/+state/plannen/plannen.actions';
import * as fromFilteredResults from '~viewer/filtered-results/+state/plannen.selectors';
import { getFilterOptions, getTimeTravelFilter } from '~viewer/filter/+state/filter.selectors';
import { LoadingState } from '~model/loading-state.enum';
import { of } from 'rxjs';
import { FilterName } from '~viewer/filter/types/filter-options';
import { ApiSource } from '~model/internal/api-source';

@Injectable()
export class SelectionEffects {
  public removeObsoleteSelections$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        PlannenActions.ihrLoadSuccess,
        PlannenActions.ihrLoadMoreSuccess,
        PlannenActions.ozonLoadSuccess,
        PlannenActions.ozonLoadMoreSuccess,
        PlannenActions.ozonOmgevingsvergunningLoadMoreSuccess,
        PlannenActions.ozonOntwerpLoadSuccess,
        PlannenActions.ozonOntwerpLoadMoreSuccess
      ),
      withLatestFrom(this.store.select(fromFilteredResults.getStatus())),
      filter(([_action, status]) => status.every(s => s === LoadingState.RESOLVED)),
      withLatestFrom(
        this.store.select(fromFilteredResults.getAllDocumentIds()),
        this.store.select(fromSelections.selectDocumentSelections)
      ),
      map(([_action, documentIds, selections]) =>
        // Selecteer alle selectionIds die niet (meer) voorkomen in de documentenlijst
        selections.filter(s => s.id).filter(s => !documentIds.includes(s.id))
      ),
      filter(selections => !!selections.length),
      map(selections =>
        // en verwijder deze uit de selection store
        // dit zorgt ervoor dat wanneer op de pagina "Documenten met regels" een filteraanpassing
        // leidt tot een geüpdatete lijst met documenten de niet langer gefilterde documenten die eerder
        // geselecteerd waren uit de selection store worden verwijderd
        SelectionActions.removeSelections({
          selections,
        })
      )
    )
  );

  public setSelectionsFromFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectionActions.setSelectionsFromFilters),
      withLatestFrom(this.store.select(getFilterOptions)),
      map(([_action, filterOptions]) => {
        const selections = filterOptions[FilterName.GEBIEDEN].map(f => ({
          id: f.id,
          name: f.name,
          apiSource: ApiSource.OZON,
          objectType: f.objectType,
        }));
        return SelectionActions.addSelections({ selections });
      })
    )
  );

  public removeSelectionsForTextElement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectionActions.removeSelectionsForAnnotation),
      withLatestFrom(this.store.select(fromSelections.selectSelections), this.store.select(getFilterOptions)),
      map(([action, selections, filterOptions]) => {
        const filtered = selections.filter(
          selection =>
            selection.elementId === action.elementId &&
            selection.regeltekstIdentificatie === action.identificatie &&
            selection.regeltekstTechnischId === action.technischId &&
            !filterOptions.gebieden.map(gebied => gebied.id).includes(selection.id)
        );
        return SelectionActions.removeSelections({ selections: filtered });
      })
    )
  );

  public loadVerbeeldingOzon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectionActions.addSelections, SelectionActions.removeSelections, SelectionActions.resetSelections),
      /**
       * Delay om bij meerdere actions achterelkaar te wachten, voordat je met de lijst van selecties de verbeeldingen ophaalt.
       * */
      delay(500),
      withLatestFrom(this.store.select(fromSelections.selectOzonSelections)),
      filter(([_action, selections]) => !!selections?.length),
      mergeMap(([_action, selections]) =>
        this.ozonProvider.fetchVerbeelding$(selections).pipe(
          map(verbeelding => SelectionActions.loadVerbeeldingSuccess({ verbeelding })),
          catchError(error =>
            of(SelectionActions.updateSelectionsFailure({ ids: selections.map(item => item.id), error }))
          )
        )
      )
    )
  );

  public loadVerbeeldingSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectionActions.loadVerbeeldingSuccess),
      withLatestFrom(this.store.select(fromSelections.selectOzonSelections), this.store.select(getTimeTravelFilter)),
      filter(([_action, selections, _timeTravelFilter]) => !!selections?.length),
      map(([action, selections, timeTravelFilter]) => {
        this.omgevingsdocumentlagenService.set(action.verbeelding, selections, !!timeTravelFilter);
        return SelectionActions.updateSelections({
          selections: selections.map(selection => ({
            ...selection,
            symboolcode:
              action.verbeelding?.symboolmetadata.find(x =>
                [selection.id, selection.parentId].includes(x.identificator)
              )?.symboolcode || selection.symboolcode,
          })),
        });
      })
    )
  );

  public showSelectionsOnMapWhenAllSymbolsInStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SelectionActions.addSelections),
      withLatestFrom(this.store.select(fromSelections.selectIhrSelections)),
      filter(([_action, selections]) => selections.filter(x => x.symboolcode).length === selections.length),
      map(([_action, _selections]) => SelectionActions.showSelectionsOnMap())
    )
  );

  public resetOmgevingsdocumentlagen$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectionActions.addSelections, SelectionActions.removeSelections, SelectionActions.resetSelections),
        withLatestFrom(this.store.select(fromSelections.selectOzonSelections)),
        tap(([_action, selections]) => {
          if (!selections.length) {
            /* Hiermee zet je de laag uit */
            this.omgevingsdocumentlagenService.set(undefined, [], false);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private ozonProvider: OzonProvider,
    private omgevingsdocumentlagenService: OmgevingsdocumentlagenService
  ) {}
}
