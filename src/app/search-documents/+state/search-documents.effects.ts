import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, filter, forkJoin, map, of } from 'rxjs';
import { PlanSuggestieCollectie } from '~ihr-model/planSuggestieCollectie';
import { RegelingSuggestieCollectie } from '~ozon-model/regelingSuggestieCollectie';
import { IhrProvider } from '~providers/ihr.provider';
import { OzonProvider } from '~providers/ozon.provider';
import { SearchDocumentsConstraints } from '~search-documents/search-documents.enum';
import * as SearchDocumentsActions from './search-documents.actions';

@Injectable()
export class SearchDocumentsEffects {
  constructor(private actions$: Actions, private ihrProvider: IhrProvider, private ozonProvider: OzonProvider) {}

  public loadSuggestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchDocumentsActions.SearchSuggestions),
      filter(action => action.value?.length >= SearchDocumentsConstraints.MIN_CHARS),
      map(action => encodeURIComponent(action.value)),
      concatMap(value =>
        forkJoin([
          this.ihrProvider.fetchPlanSuggestions$(value),
          this.ozonProvider.fetchRegelingSuggestions$(value),
        ]).pipe(
          map(([plannen, regelingen]: [PlanSuggestieCollectie, RegelingSuggestieCollectie]) =>
            SearchDocumentsActions.SearchSuggestionsSuccess({
              plannen,
              regelingen,
            })
          ),
          catchError(error => of(SearchDocumentsActions.SearchSuggestionsError({ value, error })))
        )
      )
    )
  );

  public dontLoadSuggestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchDocumentsActions.SearchSuggestions),
      filter(action => action.value?.length < SearchDocumentsConstraints.MIN_CHARS),
      map(() => SearchDocumentsActions.ResetSuggestions())
    )
  );
}
