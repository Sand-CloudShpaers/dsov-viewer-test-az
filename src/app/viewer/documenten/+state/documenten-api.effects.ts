import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { State } from './index';
import { LoadingState } from '~model/loading-state.enum';
import { Divisieannotatie } from '~ozon-model/divisieannotatie';
import { DocumentComponenten } from '~ozon-model/documentComponenten';
import { OntwerpDocumentComponenten } from '~ozon-model/ontwerpDocumentComponenten';
import { ApiUtils } from '~general/utils/api.utils';
import { findObjectInObjectWithKeyValue } from '~general/utils/object.utils';
import * as BekendmakingenActions from './bekendmakingen/bekendmakingen.actions';
import * as DivisieannotatieActions from './divisieannotatie/divisieannotatie.actions';
import * as DocumentenActions from './documenten/documenten.actions';
import * as DocumentStructuurActions from './document-structuur/document-structuur.actions';
import * as GerelateerdePlannenActions from './gerelateerde-plannen/gerelateerde-plannen.actions';
import * as RegeltekstActions from './regeltekst/regeltekst.actions';
import * as RegelsOpMaatDocumentActions from '~viewer/regels-op-maat/+state/document/document.actions';
import * as fromIhrDocumentStructuur from './document-structuur/document-structuur-ihr.selectors';
import * as fromOzonDocumentStructuur from './document-structuur/document-structuur-ozon.selectors';
import * as fromBekendmakingen from './bekendmakingen/bekendmakingen.selectors';
import * as fromGerelateerdePlannen from './gerelateerde-plannen/gerelateerde-plannen.selectors';
import * as fromDocumenten from './documenten/documenten.selectors';
import * as fromDocumentVM from './document-vm.selectors';
import { OmgevingsDocumentService } from '../services/omgevings-document.service';
import { IhrDocumentService } from '../services/ihr-document.service';
import { Regeltekst } from '~ozon-model/regeltekst';
import { OntwerpRegeltekst } from '~ozon-model/ontwerpRegeltekst';
import { OntwerpDivisieannotatie } from '~ozon-model/ontwerpDivisieannotatie';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';

@Injectable()
export class DocumentenApiEffects {
  public loadRegeling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentenActions.loadDocument),
      filter(action => ApiUtils.isRegeling(action.document.documentId)),
      concatMap(action =>
        this.omgevingsDocumentService.getRegeling$(action.document.documentId, action.timeTravelDates).pipe(
          map(document =>
            DocumentenActions.loadDocumentSuccess({
              ozon: document,
              id: action.document.documentId,
              setAsSelected: action.setAsSelected,
            })
          ),
          catchError(error => of(DocumentenActions.loadDocumentFailure({ id: action.document.documentId, error })))
        )
      )
    )
  );

  public loadOntwerpRegeling$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentenActions.loadDocument),
      filter(action => ApiUtils.isOntwerpRegeling(action.document.documentId)),
      concatMap(action =>
        this.omgevingsDocumentService.getOntwerpRegeling$(action.document.documentId).pipe(
          map(document =>
            DocumentenActions.loadDocumentSuccess({
              ozon: document,
              id: action.document.documentId,
              setAsSelected: action.setAsSelected,
            })
          ),
          catchError(error => of(DocumentenActions.loadDocumentFailure({ id: action.document.documentId, error })))
        )
      )
    )
  );

  public loadOmgevingsvergunning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentenActions.loadDocument),
      filter(action => ApiUtils.isOmgevingsvergunning(action.document.documentId)),
      concatMap(action =>
        this.omgevingsDocumentService.getOmgevingsvergunning$(action.document.documentId, action.timeTravelDates).pipe(
          map(document =>
            DocumentenActions.loadDocumentSuccess({
              ozon: document,
              id: action.document.documentId,
              setAsSelected: action.setAsSelected,
            })
          ),
          catchError(error => of(DocumentenActions.loadDocumentFailure({ id: action.document.documentId, error })))
        )
      )
    )
  );

  public loadPlan$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentenActions.loadDocument),
      filter(action => ApiUtils.isIhrDocument(action.document.documentId)),
      concatMap(action =>
        this.ihrDocumentService.getIhrDocument$(action.document.documentId).pipe(
          map(document =>
            DocumentenActions.loadDocumentSuccess({
              ihr: document,
              id: action.document.documentId,
              setAsSelected: action.setAsSelected,
            })
          ),
          catchError(error => of(DocumentenActions.loadDocumentFailure({ id: action.document.documentId, error })))
        )
      )
    )
  );

  public loadDocumentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentenActions.loadDocumentSuccess),
      filter(action => action.setAsSelected),
      map(action =>
        DocumentenActions.setSelectedDocument({
          document: {
            documentId: action.id,
            documentType: action.ozon?.type.waarde || action.ihr?.type,
          },
        })
      )
    )
  );

  public loadRegelsOpMaatPerDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromDocumenten.selectDocumentById(action.document.documentId)))
        )
      ),
      filter(([_action, document]) => !document),
      map(([action, _document]) =>
        DocumentenActions.loadDocument({
          document: action.document,
          setAsSelected: false,
        })
      )
    )
  );

  public loadDocumentStructuurForOzon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentStructuurActions.loadDocumentStructuurForSelectedDocument),
      filter(action => ApiUtils.isRegeling(action.id) || ApiUtils.isOntwerpRegeling(action.id)),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromDocumenten.selectDocumentById(action.id))),
            this.store.pipe(select(fromOzonDocumentStructuur.selectCurrentDocumentStructuur(action.id)))
          )
        )
      ),
      filter(([_action, document, documentStructuur]) => document && !documentStructuur),
      map(([action, document, _documentStructuur]) =>
        DocumentStructuurActions.loadOzonDocumentStructuur({
          id: action.id,
          href: (document.data.ozon as Regeling | OntwerpRegeling)._links.documentstructuur.href,
        })
      )
    )
  );

  public loadDocumentStructuurForIhr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentStructuurActions.loadDocumentStructuurForSelectedDocument),
      filter(action => ApiUtils.isIhrDocument(action.id) && !!action.documentSubPagePaths?.length),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.pipe(select(fromDocumentVM.getDocumentenVM(action.id))),
            this.store.pipe(select(fromIhrDocumentStructuur.selectCurrentDocumentStructuur(action.id)))
          )
        )
      ),
      map(([action, documentVM, documentStructuur]) => ({
        action,
        subPage: documentVM?.subPages.find(item => action.documentSubPagePaths.includes(item.path)),
        documentStructuur,
      })),
      filter(({ subPage, documentStructuur }) => subPage && !documentStructuur?.data.ihr[subPage.path]),
      map(({ action, subPage }) =>
        DocumentStructuurActions.loadIhrDocumentOnderdeel({
          id: action.id,
          subPage,
        })
      )
    )
  );

  public loadOzonDocumentStructuur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentStructuurActions.loadOzonDocumentStructuur),
      mergeMap(({ href, id }) =>
        this.omgevingsDocumentService.get$<DocumentComponenten | OntwerpDocumentComponenten>(href).pipe(
          map(response => DocumentStructuurActions.loadOzonDocumentStructuurSuccess({ data: response, id: id })),
          catchError(error => of(DocumentStructuurActions.loadDocumentStructuurFailure({ id, error })))
        )
      )
    )
  );

  public loadIhrDocumentOnderdelen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentStructuurActions.loadIhrDocumentOnderdeel),
      filter(action => !!action.subPage),
      mergeMap(action =>
        this.ihrDocumentService.getIhrDocumentOnderdelen$(action.id, action.subPage.href).pipe(
          map(response =>
            DocumentStructuurActions.loadIhrDocumentOnderdeelSuccess({
              data: response,
              id: action.id,
              documentSubPagePath: action.subPage.path,
            })
          ),
          catchError(error => of(DocumentStructuurActions.loadIhrDocumentOnderdeelFailure({ id: action.id, error })))
        )
      )
    )
  );

  public loadIhrDocumentStructuur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentStructuurActions.loadIhrDocumentStructuur),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromIhrDocumentStructuur.selectCurrentDocumentStructuur(action.id))))
        )
      ),
      map(([action, documentStructuur]) => ({
        action: action,
        inStore: findObjectInObjectWithKeyValue(documentStructuur?.data.ihr, 'id', action.parentId) !== null,
      })),
      filter(({ action, inStore }) => {
        if (inStore) {
          this.store.dispatch(
            DocumentStructuurActions.setLoadingState({ id: action.id, loadingState: LoadingState.RESOLVED })
          );
        }
        return !!inStore;
      }),
      mergeMap(({ action }) =>
        this.ihrDocumentService.getIhrDocumentStructuur$(action.id, action.parentId).pipe(
          map(response =>
            DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
              data: response,
              parentId: action.parentId,
              id: action.id,
            })
          ),
          catchError(error => of(DocumentStructuurActions.loadDocumentStructuurFailure({ id: action.id, error })))
        )
      )
    )
  );

  public loadIhrDocumentStructuurSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentStructuurActions.loadIhrDocumentStructuurSuccess),
      filter(action => !!action.data._links.next?.href),
      concatMap(action =>
        this.ihrDocumentService.loadMoreIhrDocumentStructuur$(action.data._links.next.href).pipe(
          map(response =>
            DocumentStructuurActions.loadIhrDocumentStructuurSuccess({
              data: response,
              parentId: action.parentId,
              id: action.id,
              addition: true,
            })
          ),
          catchError(error => of(DocumentStructuurActions.loadDocumentStructuurFailure({ id: action.id, error })))
        )
      )
    )
  );

  public loadIhrBekendmakingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BekendmakingenActions.loadIhrBekendmakingen),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromBekendmakingen.selectBekendmakingenByDocumentId(action.documentId)))
        )
      ),
      filter(([_, fromStore]) => !fromStore?.length),
      map(([action, _]) => BekendmakingenActions.loading({ documentId: action.documentId }))
    )
  );

  public loadingIhrBekendmakingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BekendmakingenActions.loading),
      mergeMap(action =>
        this.ihrDocumentService.getIHRBekendmakingen$(action.documentId).pipe(
          map(response =>
            BekendmakingenActions.loadIhrBekendmakingenSuccess({
              data: response,
              documentId: action.documentId,
            })
          ),
          catchError(error =>
            of(BekendmakingenActions.loadIhrBekendmakingenFailure({ documentId: action.documentId, error }))
          )
        )
      )
    )
  );

  public loadIhrGerelateerdePlannen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GerelateerdePlannenActions.loadGerelateerdePlannen),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromGerelateerdePlannen.getGerelateerdePlannen(action.documentId)))
        )
      ),
      filter(([_, fromStore]) => !fromStore),
      map(([action, _]) => GerelateerdePlannenActions.loading({ documentId: action.documentId }))
    )
  );

  public loadingIhrGerelateerdePlannen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GerelateerdePlannenActions.loading),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(fromDocumenten.selectDocumentById(action.documentId))))
      ),
      mergeMap(([action, document]) =>
        forkJoin([
          this.ihrDocumentService.fetchGerelateerdePlannen$(action.documentId),
          this.ihrDocumentService.fetchPlannenByDossierId$(document.data.ihr.dossier?.id),
        ]).pipe(
          map(response =>
            GerelateerdePlannenActions.loadGerelateerdePlannenSuccess({
              entity: {
                gerelateerdePlannen: response[0].gerelateerdePlannen,
                gerelateerdVanuit: response[0].gerelateerdVanuit,
                dossier: response[1]?._embedded.plannen,
              },
              documentId: action.documentId,
            })
          ),
          catchError(error =>
            of(GerelateerdePlannenActions.loadGerelateerdePlannenFailure({ documentId: action.documentId, error }))
          )
        )
      )
    )
  );

  public loadRegeltekst$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegeltekstActions.loadRegeltekst),
      filter(action => !action.isOntwerp),
      mergeMap(({ regeltekstHref, documentstructuurelementId }) =>
        this.omgevingsDocumentService.get$<Regeltekst>(regeltekstHref).pipe(
          map(regeltekst =>
            RegeltekstActions.loadRegeltekstSuccess({
              vastgesteld: regeltekst,
              documentstructuurelementId,
            })
          ),
          catchError(error =>
            of(
              RegeltekstActions.loadRegeltekstFailure({
                documentstructuurelementId,
                error,
              })
            )
          )
        )
      )
    )
  );

  public loadOntwerpRegeltekst$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegeltekstActions.loadRegeltekst),
      filter(action => action.isOntwerp),
      mergeMap(({ regeltekstHref, documentstructuurelementId }) =>
        this.omgevingsDocumentService.get$<OntwerpRegeltekst>(regeltekstHref).pipe(
          map(regeltekst =>
            RegeltekstActions.loadRegeltekstSuccess({
              ontwerp: regeltekst,
              documentstructuurelementId,
            })
          ),
          catchError(error => of(RegeltekstActions.loadRegeltekstFailure({ documentstructuurelementId, error })))
        )
      )
    )
  );

  public loadDivisieannotatie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisieannotatieActions.loadDivisieannotatie),
      filter(action => !action.isOntwerp),
      mergeMap(({ href, documentstructuurelementId }) =>
        this.omgevingsDocumentService.get$<Divisieannotatie>(href).pipe(
          map(divisie =>
            DivisieannotatieActions.loadDivisieannotatieSuccess({
              documentstructuurelementId,
              vastgesteld: divisie,
            })
          ),
          catchError(error =>
            of(
              DivisieannotatieActions.loadDivisieannotatieFailure({
                documentstructuurelementId,
                error,
              })
            )
          )
        )
      )
    )
  );

  public loadOntwerpDivisieannotatie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DivisieannotatieActions.loadDivisieannotatie),
      filter(action => action.isOntwerp),
      mergeMap(({ href, documentstructuurelementId }) =>
        this.omgevingsDocumentService.get$<OntwerpDivisieannotatie>(href).pipe(
          map(divisie =>
            DivisieannotatieActions.loadDivisieannotatieSuccess({
              documentstructuurelementId,
              ontwerp: divisie,
            })
          ),
          catchError(error =>
            of(
              DivisieannotatieActions.loadDivisieannotatieFailure({
                documentstructuurelementId,
                error,
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private omgevingsDocumentService: OmgevingsDocumentService,
    private ihrDocumentService: IhrDocumentService,
    private store: Store<State>
  ) {}
}
