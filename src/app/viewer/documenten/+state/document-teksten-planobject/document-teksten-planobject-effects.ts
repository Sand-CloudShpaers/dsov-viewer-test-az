import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LoadingState } from '~model/loading-state.enum';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { IhrDocumentHtmlService } from '~viewer/documenten/services/ihr-document-html.service';
import * as DocumentTekstenPlanobjectActions from './document-teksten-planobject.actions';

@Injectable()
export class DocumentTekstenPlanobjectEffects {
  public loadDocumentTekstenbyPlanobjectId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentTekstenPlanobjectActions.storeDocumentPlanobjectId),
      map(action =>
        DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten({
          documentId: action.documentId,
          planobjectId: action.planobjectId,
          ihrObjectInfoType: action.ihrObjectInfoType,
          ihrObjectInfoLabel: action.ihrObjectInfoLabel,
        })
      )
    )
  );

  public getIhrDocumentTekstenByplanobjectId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten),
      concatMap(action =>
        this.ihrDocumentService.getIhrDocumentTekstenByPlanobjectId$(action.documentId, action.planobjectId).pipe(
          map(response =>
            DocumentTekstenPlanobjectActions.loadDocumentTekstenSuccess({
              tekstCollectie: response,
              ihrObjectInfoType: action.ihrObjectInfoType,
              ihrObjectInfoLabel: action.ihrObjectInfoLabel,
            })
          ),
          catchError(error =>
            of(
              DocumentTekstenPlanobjectActions.loadDocumentTekstenFailure({
                documentId: action.documentId,
                planobjectId: action.planobjectId,
                error,
              })
            )
          )
        )
      )
    )
  );

  public startShowDocumentTekstenResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentTekstenPlanobjectActions.loadIhrDocumentTeksten),
      map(action =>
        DocumentTekstenPlanobjectActions.showDocumentTekstenResult({
          content: '',
          title: 'Informatie over gepinde locatie',
          subtitle: action.ihrObjectInfoType + ' - ' + action.ihrObjectInfoLabel,
          loadingStatus: LoadingState.PENDING,
        })
      )
    )
  );

  public showDocumentTekstenResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentTekstenPlanobjectActions.loadDocumentTekstenSuccess),
      map(action =>
        DocumentTekstenPlanobjectActions.showDocumentTekstenResult({
          content: IhrDocumentHtmlService.getHtmlFromTekstCollectie(action.tekstCollectie),
          loadingStatus: LoadingState.RESOLVED,
          title: 'Informatie over gepinde locatie',
          subtitle: action.ihrObjectInfoType + ' - ' + action.ihrObjectInfoLabel,
        })
      )
    )
  );

  constructor(private actions$: Actions, private ihrDocumentService: IhrDocumentService) {}
}
