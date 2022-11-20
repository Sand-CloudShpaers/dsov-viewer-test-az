import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { State } from '~viewer/documenten/+state';
import * as DocumentVersiesActions from './document-versies.actions';
import { OzonProvider } from '~providers/ozon.provider';
import { selectDocumentById } from '../documenten/documenten.selectors';
import { Regeling } from '~ozon-model/regeling';
import { OmgevingsDocumentService } from '~viewer/documenten/services/omgevings-document.service';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Voorkomens } from '~ozon-model/voorkomens';
import { getOntwerpVersies, getVastgesteldVersies } from './document-versies.selectors';

@Injectable()
export class DocumentVersiesEffects {
  /**
   * Als het een vastgetelde-regeling is, eerst valideren of het al in de store staat
   */
  public loadVastgesteld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentVersiesActions.load),
      concatMap(action => of(action).pipe(withLatestFrom(this.store.pipe(select(getVastgesteldVersies()))))),
      filter(([_action, inStore]) => !inStore?.length),
      map(([action, _inStore]) =>
        DocumentVersiesActions.loadingVastgesteld({ documentId: action.documentId, isOntwerp: action.isOntwerp })
      )
    )
  );

  /**
   * Als het een vastgestelde-regeling is, dan kan je via 'heeftBeoogdeOpvolgers' de ontwerp-versies krijgen
   */
  public loadOntwerpIfVastgesteld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentVersiesActions.load),
      filter(action => !action.isOntwerp),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(getOntwerpVersies())),
            this.store.pipe(select(selectDocumentById(action.documentId)))
          )
        )
      ),
      filter(([_action, inStore, _document]) => !inStore),
      map(([action, _inStore, document]) => ({
        documentId: action.documentId,
        hrefs: (document.data.ozon as Regeling)._links.heeftBeoogdeOpvolgers?.map(x => x.href),
      })),
      filter(({ hrefs }) => !!hrefs?.length),
      map(({ documentId, hrefs }) =>
        DocumentVersiesActions.loadingOntwerp({
          documentId,
          hrefs,
        })
      )
    )
  );

  /**
   * Als het een ontwerp-regeling is, dan zet je dit document in het lijstje
   */
  public loadOntwerpIfOntwerp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentVersiesActions.load),
      filter(action => action.isOntwerp),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(getOntwerpVersies())),
            this.store.pipe(select(selectDocumentById(action.documentId)))
          )
        )
      ),
      filter(([_action, inStore, _document]) => !inStore),
      map(([action, _inStore, document]) =>
        DocumentVersiesActions.loadingOntwerpSuccess({
          regelingen: [document.data.ozon as OntwerpRegeling],
          documentId: action.documentId,
        })
      )
    )
  );

  /**
   * Als het een vastgestelde-regeling is, dan kan je via '/voorkomens/' de vastgestelde-versies krijgen
   */
  public loadingVastgesteld$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentVersiesActions.loadingVastgesteld),
      filter(action => !action.isOntwerp),
      mergeMap(action =>
        this.ozonProvider.fetchVoorkomens$(action.documentId).pipe(
          map((response: Voorkomens) =>
            DocumentVersiesActions.loadingVastgesteldSuccess({
              documentId: action.documentId,
              regelingen: response._embedded.voorkomens,
            })
          ),
          catchError(error =>
            of(DocumentVersiesActions.loadingVastgesteldFailure({ documentId: action.documentId, error }))
          )
        )
      )
    )
  );

  /**
   * Als het een ontwerp-regeling is, dan kan je via de identificatie de vastgestelde versie ophalen.
   */
  public loadingVastgesteldFromOntwerpDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentVersiesActions.loadingVastgesteld),
      filter(action => action.isOntwerp),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(getVastgesteldVersies())),
            this.store.pipe(select(selectDocumentById(action.documentId)))
          )
        )
      ),
      filter(([_action, inStore, _document]) => !inStore?.length),
      mergeMap(([action, _inStore, document]) =>
        this.omgevingsdocumentService.getRegeling$(document.data.ozon.identificatie, null).pipe(
          map((response: Regeling) =>
            DocumentVersiesActions.loadingVastgesteldSuccess({
              documentId: action.documentId,
              regelingen: [response],
            })
          ),
          catchError(error =>
            of(DocumentVersiesActions.loadingVastgesteldFailure({ documentId: action.documentId, error }))
          )
        )
      )
    )
  );

  /**
   * Als het een vastgestelde-regeling is, dan kan je via hrefs meerdere ontwerp-versies ophalen
   */
  public loadingOntwerp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentVersiesActions.loadingOntwerp),
      mergeMap(action =>
        forkJoin(action.hrefs.map(href => this.omgevingsdocumentService.get$<OntwerpRegeling>(href))).pipe(
          map((response: OntwerpRegeling[]) =>
            DocumentVersiesActions.loadingOntwerpSuccess({
              documentId: action.documentId,
              regelingen: response,
            })
          ),
          catchError(error =>
            of(DocumentVersiesActions.loadingOntwerpFailure({ documentId: action.documentId, error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private ozonProvider: OzonProvider,
    private omgevingsdocumentService: OmgevingsDocumentService
  ) {}
}
