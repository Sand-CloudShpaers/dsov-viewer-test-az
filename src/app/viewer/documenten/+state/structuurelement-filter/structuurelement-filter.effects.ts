import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { OmgevingsDocumentService } from '../../services/omgevings-document.service';
import * as StructuurelementFilterActions from './structuurelement-filter.actions';
import * as fromDocumentVM from '~viewer/documenten/+state/document-vm.selectors';
import { DivisieannotatieZoekParameter } from '~ozon-model/divisieannotatieZoekParameter';
import { ZoekParameters } from '~general/utils/filter.utils';
import { Store } from '@ngrx/store';
import { State } from '../index';
import { isArtikelStructuur, isVrijeTekstStructuur } from '~viewer/documenten/utils/document-utils';
import { OntwerpRegeltekstZoekParameter } from '~ozon-model/ontwerpRegeltekstZoekParameter';
import { OntwerpDivisieannotatieZoekParameter } from '~ozon-model/ontwerpDivisieannotatieZoekParameter';
import { RegeltekstZoekParameter } from '~ozon-model/regeltekstZoekParameter';
import { ApiUtils } from '~general/utils/api.utils';

@Injectable()
export class StructuurElementFilterEffects {
  public setFilterForArtikelStructuur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StructuurelementFilterActions.loadFilter),
      filter(action => !!action.themaId && ApiUtils.isRegeling(action.document.documentId)),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(fromDocumentVM.getDocumentenVM(action.document.documentId))))
      ),
      filter(([_action, documentVM]) => isArtikelStructuur(documentVM.type)),
      mergeMap(([action]) => {
        const regeltekstZoekParameters: ZoekParameters[] = [
          {
            parameter: RegeltekstZoekParameter.ParameterEnum.DocumentIdentificatie,
            zoekWaarden: [action.document.documentId],
          },
        ];

        if (action.themaId) {
          regeltekstZoekParameters.push({
            parameter: RegeltekstZoekParameter.ParameterEnum.ThemaCode,
            zoekWaarden: [action.themaId],
          });
        }

        return this.omgevingsDocumentService.getRegelteksten$(regeltekstZoekParameters).pipe(
          map(response =>
            StructuurelementFilterActions.loadFilterSuccess({
              id: action.id,
              regelteksten: response?._embedded.regelteksten.map(x => ({
                id: x.identificatie,
                documentIdentificatie: x.documentIdentificatie,
                vastgesteld: x,
              })),
              divisieannotaties: [],
            })
          ),
          catchError(error =>
            of(
              StructuurelementFilterActions.loadFilterFailure({
                id: action.id,
                error,
              })
            )
          )
        );
      })
    )
  );

  public setFilterForVrijeTekstStructuur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StructuurelementFilterActions.loadFilter),
      filter(action => (!!action.hoofdlijnId || !!action.themaId) && ApiUtils.isRegeling(action.document.documentId)),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(fromDocumentVM.getDocumentenVM(action.document.documentId))))
      ),
      filter(([_action, documentVM]) => isVrijeTekstStructuur(documentVM.type)),
      mergeMap(([action]) => {
        const divisieZoekParameters: ZoekParameters[] = [
          {
            parameter: DivisieannotatieZoekParameter.ParameterEnum.DocumentIdentificatie,
            zoekWaarden: [action.document.documentId],
          },
        ];

        if (action.hoofdlijnId) {
          divisieZoekParameters.push({
            parameter: DivisieannotatieZoekParameter.ParameterEnum.HoofdlijnIdentificatie,
            zoekWaarden: [action.hoofdlijnId],
          });
        }

        if (action.themaId) {
          divisieZoekParameters.push({
            parameter: DivisieannotatieZoekParameter.ParameterEnum.ThemaCode,
            zoekWaarden: [action.themaId],
          });
        }

        return this.omgevingsDocumentService.getDivisieannotaties$(divisieZoekParameters).pipe(
          map(response =>
            StructuurelementFilterActions.loadFilterSuccess({
              id: action.id,
              regelteksten: [],
              divisieannotaties: response?._embedded.divisieannotaties.map(x => ({
                id: x.identificatie,
                documentIdentificatie: x.documentIdentificatie,
                vastgesteld: x,
              })),
            })
          ),
          catchError(error =>
            of(
              StructuurelementFilterActions.loadFilterFailure({
                id: action.id,
                error,
              })
            )
          )
        );
      })
    )
  );

  public setOntwerpFilterForArtikelStructuur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StructuurelementFilterActions.loadFilter),
      filter(
        action => (!!action.hoofdlijnId || !!action.themaId) && ApiUtils.isOntwerpRegeling(action.document.documentId)
      ),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(fromDocumentVM.getDocumentenVM(action.document.documentId))))
      ),
      filter(([_action, documentVM]) => isArtikelStructuur(documentVM.type)),
      mergeMap(([action, documentVM]) => {
        const ontwerpRegeltekstZoekParameters: ZoekParameters[] = [
          {
            parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
            zoekWaarden: [documentVM.documentId],
          },
        ];

        if (action.themaId) {
          ontwerpRegeltekstZoekParameters.push({
            parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.ThemaCode,
            zoekWaarden: [action.themaId],
          });
        }

        return this.omgevingsDocumentService.getOntwerpRegelteksten$(ontwerpRegeltekstZoekParameters).pipe(
          map(response =>
            StructuurelementFilterActions.loadFilterSuccess({
              id: action.id,
              regelteksten: response?._embedded.ontwerpRegelteksten.map(x => ({
                id: x.technischId,
                documentIdentificatie: x.documentTechnischId,
                ontwerp: x,
              })),
              divisieannotaties: [],
            })
          ),
          catchError(error =>
            of(
              StructuurelementFilterActions.loadFilterFailure({
                id: action.id,
                error,
              })
            )
          )
        );
      })
    )
  );

  public setOntwerpFilterForVrijeTekstStructuur$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StructuurelementFilterActions.loadFilter),
      filter(
        action => (!!action.hoofdlijnId || !!action.themaId) && ApiUtils.isOntwerpRegeling(action.document.documentId)
      ),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.select(fromDocumentVM.getDocumentenVM(action.document.documentId))))
      ),
      filter(([_action, documentVM]) => isVrijeTekstStructuur(documentVM.type)),
      mergeMap(([action, documentVM]) => {
        const ontwerpDivisieZoekParameters: ZoekParameters[] = [
          {
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
            zoekWaarden: [documentVM.documentId],
          },
        ];

        if (action.hoofdlijnId) {
          ontwerpDivisieZoekParameters.push({
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.HoofdlijnIdentificatie,
            zoekWaarden: [action.hoofdlijnId],
          });
        }

        if (action.themaId) {
          ontwerpDivisieZoekParameters.push({
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.ThemaCode,
            zoekWaarden: [action.themaId],
          });
        }

        return this.omgevingsDocumentService.getOntwerpDivisieannotaties$(ontwerpDivisieZoekParameters).pipe(
          map(response =>
            StructuurelementFilterActions.loadFilterSuccess({
              id: action.id,
              regelteksten: [],
              divisieannotaties: response?._embedded.ontwerpdivisieannotaties.map(x => ({
                id: x.technischId,
                documentIdentificatie: x.documentTechnischId,
                ontwerp: x,
              })),
            })
          ),
          catchError(error =>
            of(
              StructuurelementFilterActions.loadFilterFailure({
                id: action.id,
                error,
              })
            )
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private omgevingsDocumentService: OmgevingsDocumentService
  ) {}
}
