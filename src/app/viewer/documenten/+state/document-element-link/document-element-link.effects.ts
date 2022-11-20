import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, withLatestFrom } from 'rxjs/operators';
import { LoadingState } from '~model/loading-state.enum';
import { State } from '~viewer/documenten/+state';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import { IhrDocumentHtmlService } from '~viewer/documenten/services/ihr-document-html.service';
import * as fromDocumentenVM from '~viewer/documenten/+state/document-vm.selectors';
import * as fromDocumentStructuurOzon from '~viewer/documenten/+state/document-structuur/document-structuur-ozon.selectors';
import * as documentElementLinkActions from './document-element-link.actions';
import { ApiUtils } from '~general/utils/api.utils';

@Injectable()
export class DocumentElementLinkEffects {
  public loadDocumentElementById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(documentElementLinkActions.storeDocumentElementLink),
      map(action => {
        if (ApiUtils.isIhrDocument(action.documentId)) {
          return documentElementLinkActions.loadIhrDocumentElement({
            documentId: action.documentId,
            elementId: action.elementId,
          });
        }
        return documentElementLinkActions.loadOzonLinkTekst({
          elementId: action.elementId,
          documentId: action.documentId,
          nodeType: action.nodeType,
        });
      })
    )
  );

  public getIhrDocumentElementById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(documentElementLinkActions.loadIhrDocumentElement),
      concatMap(action =>
        this.ihrDocumentService.getIhrDocumentElementById$(action.documentId, action.elementId).pipe(
          map(tekst =>
            documentElementLinkActions.loadIhrDocumentElementSucces({
              tekst,
              documentId: action.documentId,
              elementId: action.elementId,
            })
          ),
          catchError(error =>
            of(
              documentElementLinkActions.loadDocumentElementFailure({
                documentId: action.documentId,
                elementId: action.elementId,
                error,
              })
            )
          )
        )
      )
    )
  );

  public startShowDocumentElementLinkResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(documentElementLinkActions.loadIhrDocumentElement),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.pipe(select(fromDocumentenVM.getDocumentenVM(action.documentId)))))
      ),
      map(([_action, documentVM]) =>
        documentElementLinkActions.showDocumentElementLinkResult({
          content: '',
          documentId: documentVM.documentId,
          title: documentVM?.title,
          subtitle: documentVM?.bevoegdGezag.naam,
          loadingStatus: LoadingState.PENDING,
        })
      )
    )
  );

  public getOzonLinkTekst$ = createEffect(() =>
    this.actions$.pipe(
      ofType(documentElementLinkActions.loadOzonLinkTekst),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromDocumentenVM.getDocumentenVM(action.documentId))),
            this.store.pipe(
              select(fromDocumentStructuurOzon.getElement(action.documentId, action.elementId, action.nodeType))
            )
          )
        )
      ),
      map(([_action, documentVM, element]) =>
        documentElementLinkActions.showDocumentElementLinkResult({
          element,
          documentId: documentVM.documentId,
          title: documentVM?.title,
          subtitle: documentVM?.bevoegdGezag.naam,
          loadingStatus: LoadingState.RESOLVED,
        })
      )
    )
  );

  public showDocumentElementWithContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(documentElementLinkActions.loadIhrDocumentElementSucces),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.pipe(select(fromDocumentenVM.getDocumentenVM(action.documentId)))))
      ),
      map(([action, documentVM]) =>
        documentElementLinkActions.showDocumentElementLinkResult({
          content: IhrDocumentHtmlService.getHtmlFromTekst(action.tekst),
          documentId: documentVM.documentId,
          title: documentVM?.title,
          subtitle: documentVM?.bevoegdGezag.naam,
          loadingStatus: LoadingState.RESOLVED,
        })
      )
    )
  );

  constructor(private actions$: Actions, private ihrDocumentService: IhrDocumentService, private store: Store<State>) {}
}
