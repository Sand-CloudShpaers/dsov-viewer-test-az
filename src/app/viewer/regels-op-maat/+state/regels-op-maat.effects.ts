import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ApiSource } from '~model/internal/api-source';
import { Regelteksten } from '~ozon-model/regelteksten';
import { Divisieannotaties } from '~ozon-model/divisieannotaties';
import { OntwerpRegelteksten } from '~ozon-model/ontwerpRegelteksten';
import { OntwerpDivisieannotaties } from '~ozon-model/ontwerpDivisieannotaties';
import { OntwerpRegeltekstZoekParameter } from '~ozon-model/ontwerpRegeltekstZoekParameter';
import { OntwerpDivisieannotatieZoekParameter } from '~ozon-model/ontwerpDivisieannotatieZoekParameter';
import {
  getOzonLocaties,
  getOzonOntwerpLocatieTechnischIds,
} from '~store/common/ozon-locaties/+state/ozon-locaties.selectors';
import { ConfigService } from '~services/config.service';
import { State } from './index';
import { IhrDocumentService } from '~viewer/documenten/services/ihr-document.service';
import {
  divisieannotatiesUrl,
  OmgevingsDocumentService,
  ontwerpdivisieannotatiesUrl,
} from '~viewer/documenten/services/omgevings-document.service';
import { isArtikelStructuur, isVrijeTekstStructuur } from '~viewer/documenten/utils/document-utils';
import { getFilterOptions, getFilterOptionsForLocatie } from '~viewer/filter/+state/filter.selectors';
import { FilterName, FilterOptions } from '~viewer/filter/types/filter-options';
import { DivisieannotatieZoekParameter } from '~ozon-model/divisieannotatieZoekParameter';
import { RegeltekstZoekParameter } from '~ozon-model/regeltekstZoekParameter';
import * as RegelsOpMaatDocumentActions from './document/document.actions';
import * as fromRegelsOpMaatDocumenten from './document/document.selectors';
import * as RegelsOpMaatActions from './regels-op-maat/regels-op-maat.actions';
import { FilterUtils, ZoekParameters } from '~general/utils/filter.utils';
import {
  documentregeltekstZoekUrl,
  documentvrijetekstZoekUrl,
  ontwerpRegeltekstZoekUrl,
  OzonDocumentenService,
  regeltekstZoekUrl,
} from '~viewer/filtered-results/services/ozon-documenten.service';
import { selectDocumentIds } from './document/document.selectors';
import { SelectionObjectType } from '~store/common/selection/selection.model';
import { ApiUtils } from '~general/utils/api.utils';

@Injectable()
export class RegelsOpMaatEffects {
  public loadRegelsOpMaat$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatActions.loadRegelsOpMaat),
      withLatestFrom(this.store.select(getFilterOptions)),
      filter(([_action, filterOptions]) => !!filterOptions.activiteit.length || !!filterOptions.gebieden.length),
      map(() =>
        RegelsOpMaatActions.loadRegelsOpMaatDocumenten({
          regelsUrl: `${this.configService.config.ozon.url}${documentregeltekstZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`,
          tekstdelenUrl: `${this.configService.config.ozon.url}${documentvrijetekstZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`,
          documents: [],
        })
      )
    )
  );

  /** Als de documenten WEL in de store voorkomen */
  public loadRegelsOpMaatWithDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatActions.loadRegelsOpMaat),
      withLatestFrom(this.store.select(getFilterOptions), this.store.select(selectDocumentIds)),
      filter(
        ([_action, filterOptions, inStore]) =>
          !filterOptions.documenten?.some(item => !inStore?.includes(item.document.documentId))
      ),
      map(([_action, filterOptions]) =>
        RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: filterOptions.documenten.map(x => x.document),
        })
      )
    )
  );

  /**
   * Als de documenten NIET in de store voorkomen, bijv. via deeplink.
   * Dit effect is alleen voor OZON Regelingen (OVREK-6177)
   *
   * Dit is nodig omdat het tijdelijk deel afhankelijk is van de locatie id's,
   * dus dan moet je deze documenten expliciet via deze route laten lopen.
   * */
  public loadRegelsOpMaatWithoutDocumentsOzonRegelingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatActions.loadRegelsOpMaat),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(getFilterOptions),
        this.store.select(selectDocumentIds)
      ),
      filter(([_action, _ozonLocatiesIds, filterOptions, inStore]) =>
        /** Alleen voor Vastgestelde regelingen (van OZON) */
        filterOptions.documenten
          .filter(item => ApiUtils.isRegeling(item.document.documentId))
          .some(item => !inStore.includes(item.document.documentId))
      ),
      concatMap(([_action, ozonLocatiesIds, filterOptions]) =>
        this.ozonDocumentenService.loadOzonDocumenten$(ozonLocatiesIds, filterOptions, false).pipe(
          map(response => {
            /** Wegschrijven naar store */
            this.store.dispatch(
              RegelsOpMaatActions.loadDocumentsSuccess({
                regelingen: response[0].concat(response[1]),
              })
            );
            /** Proces vervolgen in regels op maat */
            return RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
              documents: filterOptions.documenten.map(x => x.document),
            });
          }),
          catchError(error =>
            of(
              RegelsOpMaatActions.loadRegelsOpMaatFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  /**
   * Als de documenten NIET in de store voorkomen, bijv. via deeplink.
   * Dit effect is voor OZON OntwerpRegelingen en IHR plannen (OVREK-6177)
   *
   * Dit is nodig omdat OZON Ontwerpregelingen en IHR plannen in het effect
   * loadRegelsOpMaatWithoutDocumentsOzonRegelingen$ worden geblokkeerd
   */
  public loadRegelsOpMaatWithoutDocumentsNotOzonRegelingen$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatActions.loadRegelsOpMaat),
      withLatestFrom(this.store.select(getFilterOptions), this.store.select(selectDocumentIds)),
      filter(([_action, filterOptions, inStore]) =>
        filterOptions.documenten
          .filter(
            item =>
              ApiUtils.isIhrDocument(item.document.documentId) ||
              ApiUtils.isOntwerpRegeling(item.document.documentId) ||
              ApiUtils.isOmgevingsvergunning(item.document.documentId)
          )
          .some(item => !inStore?.includes(item.document.documentId))
      ),
      map(([_action, filterOptions]) =>
        RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
          documents: filterOptions.documenten.map(x => x.document),
        })
      )
    )
  );

  public iterateOverDocuments$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RegelsOpMaatActions.loadRegelsOpMaatWithDocuments),
        map(action => {
          /*  Hier lopen we door de documentIds om per document de regels op te halen. */
          action.documents.forEach(document => {
            this.store.dispatch(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument({
                document,
              })
            );
          });
        })
      ),
    { dispatch: false }
  );

  public loadRegelsOpMaatDocumenten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatActions.loadRegelsOpMaatDocumenten),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getFilterOptions)),
      mergeMap(([action, ozonLocatieIds, filterOptions]) => {
        const zoekParameters: ZoekParameters[] = [
          {
            parameter: RegeltekstZoekParameter.ParameterEnum.LocatieIdentificatie,
            zoekWaarden: ozonLocatieIds,
          },
          ...this.addToZoekParameters(filterOptions, documentregeltekstZoekUrl),
        ];

        return this.omgevingsDocumentService
          .getOmgevingsDocumenten$(zoekParameters, action.regelsUrl, action.tekstdelenUrl)
          .pipe(
            map(response => {
              let documents = action.documents;

              response.forEach(item => {
                const omgevingsdocumenten = item?._embedded?.regelingen;
                if (omgevingsdocumenten) {
                  documents = documents.concat(
                    omgevingsdocumenten.map(document => ({
                      documentId: document.identificatie,
                      documentType: document.type.waarde,
                    }))
                  );
                }
              });

              const loadMoreLinks = response.filter(item => !!item?._links?.next);
              if (loadMoreLinks.length) {
                /* Laad meer */
                return RegelsOpMaatActions.loadRegelsOpMaatDocumenten({
                  regelsUrl: response[0]?._links?.next?.href,
                  tekstdelenUrl: response[1]?._links?.next?.href,
                  documents,
                });
              } else {
                /* Klaar! */
                return RegelsOpMaatActions.loadRegelsOpMaatWithDocuments({
                  documents,
                });
              }
            }),
            catchError(error =>
              of(
                RegelsOpMaatActions.loadRegelsOpMaatFailure({
                  error,
                })
              )
            )
          );
      })
    )
  );

  /* For OZON */
  public loadRegelteksten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      filter(
        action => ApiUtils.isRegeling(action.document.documentId) && isArtikelStructuur(action.document.documentType)
      ),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getFilterOptions)),
      mergeMap(([action, ozonLocatieIds, filterOptions]) => {
        const zoekParameters: ZoekParameters[] = [
          {
            parameter: RegeltekstZoekParameter.ParameterEnum.DocumentIdentificatie,
            zoekWaarden: [action.document.documentId],
          },
          {
            parameter: RegeltekstZoekParameter.ParameterEnum.LocatieIdentificatie,
            zoekWaarden: ozonLocatieIds,
          },
          ...this.addToZoekParameters(filterOptions, regeltekstZoekUrl),
        ];
        return this.omgevingsDocumentService.getRegelteksten$(zoekParameters).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: response?._embedded.regelteksten || [],
              ontwerpRegelteksten: [],
              divisieannotaties: [],
              ontwerpDivisieannotaties: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  regelteksten: {
                    href: response._links.next?.href,
                    zoekParameters,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        );
      })
    )
  );

  public loadDivisies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      filter(
        action => ApiUtils.isRegeling(action.document.documentId) && isVrijeTekstStructuur(action.document.documentType)
      ),
      withLatestFrom(this.store.select(getOzonLocaties), this.store.select(getFilterOptions)),
      mergeMap(([action, ozonLocatieIds, filterOptions]) => {
        const zoekParameters: ZoekParameters[] = [
          {
            parameter: DivisieannotatieZoekParameter.ParameterEnum.DocumentIdentificatie,
            zoekWaarden: [action.document.documentId],
          },
          {
            parameter: DivisieannotatieZoekParameter.ParameterEnum.LocatieIdentificatie,
            zoekWaarden: ozonLocatieIds,
          },
          ...this.addToZoekParameters(filterOptions, divisieannotatiesUrl),
        ];
        return this.omgevingsDocumentService.getDivisieannotaties$(zoekParameters).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: [],
              ontwerpRegelteksten: [],
              divisieannotaties: response?._embedded.divisieannotaties || [],
              ontwerpDivisieannotaties: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  divisieannotaties: {
                    href: response?._links?.next?.href,
                    zoekParameters,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        );
      })
    )
  );

  public loadOmgevingsvergunning$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      filter(action => ApiUtils.isOmgevingsvergunning(action.document.documentId)),
      map(action =>
        RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
          document: action.document,
          apiSource: ApiSource.OZON,
          regelteksten: [],
          ontwerpRegelteksten: [],
          divisieannotaties: [],
          ontwerpDivisieannotaties: [],
          teksten: [],
          loadMoreLinks: {
            vastgesteld: {},
          },
        })
      )
    )
  );

  public loadOntwerpRegelteksten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      filter(
        action =>
          ApiUtils.isOntwerpRegeling(action.document.documentId) && isArtikelStructuur(action.document.documentType)
      ),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(getOzonOntwerpLocatieTechnischIds),
        this.store.select(getFilterOptions)
      ),
      mergeMap(([action, ozonLocatieIds, ontwerpLocatieTechnischIds, filterOptions]) => {
        const zoekParametersFromFilterOptions = this.addToZoekParameters(filterOptions, ontwerpRegeltekstZoekUrl);
        const ontwerpdocumentIdentificatie_vastgesteldeLocaties: ZoekParameters[] = [
          {
            parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
            zoekWaarden: [action.document.documentId],
          },
          {
            parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.LocatieIdentificatie,
            zoekWaarden: ozonLocatieIds,
          },
          ...zoekParametersFromFilterOptions,
        ];
        const ontwerpdocumentIdentificatie_ontwerpLocaties: ZoekParameters[] = [
          {
            parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
            zoekWaarden: [action.document.documentId],
          },
          {
            parameter: OntwerpRegeltekstZoekParameter.ParameterEnum.OntwerplocatieTechnischId,
            zoekWaarden: ontwerpLocatieTechnischIds,
          },
          ...zoekParametersFromFilterOptions,
        ];
        return forkJoin([
          this.omgevingsDocumentService.getOntwerpRegelteksten$(ontwerpdocumentIdentificatie_vastgesteldeLocaties),
          this.omgevingsDocumentService.getOntwerpRegelteksten$(ontwerpdocumentIdentificatie_ontwerpLocaties),
        ]).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: [],
              ontwerpRegelteksten: (response[0]?._embedded?.ontwerpRegelteksten || []).concat(
                response[1]?._embedded?.ontwerpRegelteksten || []
              ),
              divisieannotaties: [],
              ontwerpDivisieannotaties: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {},
                ontwerp: {
                  regeltekstenVastgesteldeLocaties: {
                    href: response[0]?._links?.next?.href,
                    zoekParameters: ontwerpdocumentIdentificatie_vastgesteldeLocaties,
                  },
                  regeltekstenOntwerpLocaties: {
                    href: response[1]?._links?.next?.href,
                    zoekParameters: ontwerpdocumentIdentificatie_ontwerpLocaties,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        );
      })
    )
  );

  public loadOntwerpDivisies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      filter(
        action =>
          ApiUtils.isOntwerpRegeling(action.document.documentId) && isVrijeTekstStructuur(action.document.documentType)
      ),
      withLatestFrom(
        this.store.select(getOzonLocaties),
        this.store.select(getOzonOntwerpLocatieTechnischIds),
        this.store.select(getFilterOptions)
      ),
      mergeMap(([action, ozonLocatieIds, ontwerpLocatieTechnischIds, filterOptions]) => {
        const zoekParametersFromFilterOptions = this.addToZoekParameters(filterOptions, ontwerpdivisieannotatiesUrl);
        const ontwerpdocumentIdentificatie_vastgesteldeLocaties: ZoekParameters[] = [
          {
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
            zoekWaarden: [action.document.documentId],
          },
          {
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.LocatieIdentificatie,
            zoekWaarden: ozonLocatieIds,
          },
          ...zoekParametersFromFilterOptions,
        ];
        const ontwerpdocumentIdentificatie_ontwerpLocaties: ZoekParameters[] = [
          {
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerpdocumentTechnischId,
            zoekWaarden: [action.document.documentId],
          },
          {
            parameter: OntwerpDivisieannotatieZoekParameter.ParameterEnum.OntwerplocatieTechnischId,
            zoekWaarden: ontwerpLocatieTechnischIds,
          },
          ...zoekParametersFromFilterOptions,
        ];
        return forkJoin([
          this.omgevingsDocumentService.getOntwerpDivisieannotaties$(ontwerpdocumentIdentificatie_vastgesteldeLocaties),
          this.omgevingsDocumentService.getOntwerpDivisieannotaties$(ontwerpdocumentIdentificatie_ontwerpLocaties),
        ]).pipe(
          map(response => {
            const ontwerpDivisieannotatiesVastgesteldeLocaties = response[0]?._embedded?.ontwerpdivisieannotaties || [];
            const ontwerpDivisieannotatiesOntwerpLocaties = response[1]?._embedded?.ontwerpdivisieannotaties || [];

            return RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: [],
              ontwerpRegelteksten: [],
              divisieannotaties: [],
              ontwerpDivisieannotaties: ontwerpDivisieannotatiesVastgesteldeLocaties.concat(
                ontwerpDivisieannotatiesOntwerpLocaties
              ),
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {},
                ontwerp: {
                  divisieannotatiesVastgesteldeLocaties: {
                    href: response[0]?._links?.next?.href,
                    zoekParameters: ontwerpdocumentIdentificatie_vastgesteldeLocaties,
                  },
                  divisieannotatiesOntwerpLocaties: {
                    href: response[1]?._links?.next?.href,
                    zoekParameters: ontwerpdocumentIdentificatie_ontwerpLocaties,
                  },
                },
              },
            });
          }),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        );
      })
    )
  );

  /* For OZON */
  public loadMoreRegelteksten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocument),
      filter(
        action => ApiUtils.isRegeling(action.document.documentId) && isArtikelStructuur(action.document.documentType)
      ),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromRegelsOpMaatDocumenten.selectDocument(action.document.documentId)))
        )
      ),
      map(([action, document]) => ({
        action,
        document,
        loadMoreLinks: [document?.loadMoreLinks?.vastgesteld.regelteksten],
      })),
      filter(({ loadMoreLinks }) => loadMoreLinks.some(x => x?.href)),
      mergeMap(({ action, loadMoreLinks }) =>
        this.omgevingsDocumentService.post$<Regelteksten>(loadMoreLinks[0].zoekParameters, loadMoreLinks[0].href).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: response._embedded?.regelteksten || [],
              ontwerpRegelteksten: [],
              divisieannotaties: [],
              ontwerpDivisieannotaties: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  regelteksten: {
                    href: response?._links?.next?.href,
                    zoekParameters: loadMoreLinks[0].zoekParameters,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        )
      )
    )
  );

  public loadMoreDivisieannotaties$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocument),
      filter(
        action => ApiUtils.isRegeling(action.document.documentId) && isVrijeTekstStructuur(action.document.documentType)
      ),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromRegelsOpMaatDocumenten.selectDocument(action.document.documentId)))
        )
      ),
      map(([action, document]) => ({
        action,
        document,
        loadMore: document.loadMoreLinks.vastgesteld.divisieannotaties,
      })),
      filter(({ loadMore }) => !!loadMore?.href),
      mergeMap(({ action, loadMore }) =>
        this.omgevingsDocumentService.post$<Divisieannotaties>(loadMore?.zoekParameters, loadMore.href).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: [],
              ontwerpRegelteksten: [],
              divisieannotaties: response?._embedded?.divisieannotaties || [],
              ontwerpDivisieannotaties: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  divisieannotaties: {
                    href: response?._links?.next?.href,
                    zoekParameters: loadMore.zoekParameters,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        )
      )
    )
  );

  public loadMoreOntwerpRegelteksten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocument),
      filter(
        action =>
          ApiUtils.isOntwerpRegeling(action.document.documentId) && isArtikelStructuur(action.document.documentType)
      ),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromRegelsOpMaatDocumenten.selectDocument(action.document.documentId)))
        )
      ),
      map(([action, document]) => ({
        action,
        document,
        loadMore: [
          document.loadMoreLinks.vastgesteld.regelteksten,
          document.loadMoreLinks.ontwerp?.regeltekstenVastgesteldeLocaties,
          document.loadMoreLinks.ontwerp?.regeltekstenOntwerpLocaties,
        ],
      })),
      filter(({ loadMore }) => loadMore.some(x => x?.href)),
      mergeMap(({ action, loadMore }) =>
        forkJoin([
          this.omgevingsDocumentService.post$<Regelteksten>(loadMore[0]?.zoekParameters, loadMore[0]?.href),
          this.omgevingsDocumentService.post$<OntwerpRegelteksten>(loadMore[1]?.zoekParameters, loadMore[1]?.href),
          this.omgevingsDocumentService.post$<OntwerpRegelteksten>(loadMore[2]?.zoekParameters, loadMore[2]?.href),
        ]).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: response[0]?._embedded?.regelteksten || [],
              ontwerpRegelteksten: (response[1]?._embedded?.ontwerpRegelteksten || []).concat(
                response[2]?._embedded?.ontwerpRegelteksten || []
              ),
              divisieannotaties: [],
              ontwerpDivisieannotaties: [],
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  regelteksten: {
                    href: response[0]?._links?.next?.href,
                    zoekParameters: loadMore[0]?.zoekParameters,
                  },
                },
                ontwerp: {
                  regeltekstenVastgesteldeLocaties: {
                    href: response[1]?._links?.next?.href,
                    zoekParameters: loadMore[1]?.zoekParameters,
                  },
                  regeltekstenOntwerpLocaties: {
                    href: response[2]?._links?.next?.href,
                    zoekParameters: loadMore[2]?.zoekParameters,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        )
      )
    )
  );

  public loadMoreOntwerpDivisies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocument),
      filter(
        action =>
          ApiUtils.isOntwerpRegeling(action.document.documentId) && isVrijeTekstStructuur(action.document.documentType)
      ),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromRegelsOpMaatDocumenten.selectDocument(action.document.documentId)))
        )
      ),
      map(([action, document]) => ({
        action,
        document,
        loadMore: [
          document.loadMoreLinks.vastgesteld.divisieannotaties,
          document.loadMoreLinks.ontwerp?.divisieannotatiesVastgesteldeLocaties,
          document.loadMoreLinks.ontwerp?.divisieannotatiesOntwerpLocaties,
        ],
      })),
      filter(({ loadMore }) => loadMore.some(x => x?.href)),
      mergeMap(({ action, loadMore }) =>
        forkJoin([
          this.omgevingsDocumentService.post$<Divisieannotaties>(loadMore[0]?.zoekParameters, loadMore[0]?.href),
          this.omgevingsDocumentService.post$<OntwerpDivisieannotaties>(loadMore[1]?.zoekParameters, loadMore[1]?.href),
          this.omgevingsDocumentService.post$<OntwerpDivisieannotaties>(loadMore[2]?.zoekParameters, loadMore[2]?.href),
        ]).pipe(
          map(response =>
            RegelsOpMaatDocumentActions.loadMoreRegelsOpMaatPerDocumentSuccess({
              document: action.document,
              apiSource: ApiSource.OZON,
              regelteksten: [],
              ontwerpRegelteksten: [],
              divisieannotaties: response[0]?._embedded?.divisieannotaties || [],
              ontwerpDivisieannotaties: (response[1]?._embedded?.ontwerpdivisieannotaties || []).concat(
                response[2]?._embedded?.ontwerpdivisieannotaties || []
              ),
              teksten: [],
              loadMoreLinks: {
                vastgesteld: {
                  divisieannotaties: {
                    href: response[0]?._links?.next?.href,
                    zoekParameters: loadMore[0]?.zoekParameters,
                  },
                },
                ontwerp: {
                  divisieannotatiesVastgesteldeLocaties: {
                    href: response[1]?._links?.next?.href,
                    zoekParameters: loadMore[1]?.zoekParameters,
                  },
                  divisieannotatiesOntwerpLocaties: {
                    href: response[2]?._links?.next?.href,
                    zoekParameters: loadMore[2]?.zoekParameters,
                  },
                },
              },
            })
          ),
          catchError(error =>
            of(
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                document: action.document,
                error,
              })
            )
          )
        )
      )
    )
  );

  /* For IHR */
  public loadTeksten$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocument),
      filter(action => ApiUtils.isIhrDocument(action.document.documentId)),
      withLatestFrom(this.store.select(getFilterOptionsForLocatie)),
      filter(([_action, filterOptionsForLocatie]) => !!filterOptionsForLocatie[FilterName.LOCATIE][0]?.geometry),
      mergeMap(([action, filterOptionsForLocatie]) =>
        this.ihrDocumentService
          .getIhrDocumentArtikelen$(action.document.documentId, filterOptionsForLocatie[FilterName.LOCATIE][0].geometry)
          .pipe(
            map(response =>
              RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentSuccess({
                document: action.document,
                apiSource: ApiSource.IHR,
                regelteksten: [],
                ontwerpRegelteksten: [],
                divisieannotaties: [],
                ontwerpDivisieannotaties: [],
                teksten: response?._embedded?.teksten,
              })
            ),
            catchError(error =>
              of(
                RegelsOpMaatDocumentActions.loadRegelsOpMaatPerDocumentFailure({
                  document: action.document,
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
    private store: Store<State>,
    private omgevingsDocumentService: OmgevingsDocumentService,
    private ozonDocumentenService: OzonDocumentenService,
    private ihrDocumentService: IhrDocumentService,
    private configService: ConfigService
  ) {}

  public addToZoekParameters(filterOptions: FilterOptions, url: string): ZoekParameters[] {
    const zoekParameters: ZoekParameters[] = [];

    zoekParameters.push(
      ...FilterUtils.getZoekParameterFromFilter(filterOptions[FilterName.ACTIVITEIT], 'activiteit.identificatie')
    );

    zoekParameters.push(...FilterUtils.getZoekParameterFromFilter(filterOptions[FilterName.THEMA], 'thema.code'));

    if (filterOptions.gebieden?.length) {
      const omgevingsnormen = filterOptions.gebieden.filter(
        x => x.objectType === SelectionObjectType.OMGEVINGSNORM_NORMWAARDE
      );
      const omgevingswaarden = filterOptions.gebieden.filter(
        x => x.objectType === SelectionObjectType.OMGEVINGSWAARDE_NORMWAARDE
      );
      const gebiedsaanwijzingen = filterOptions.gebieden.filter(
        x => x.objectType === SelectionObjectType.GEBIEDSAANWIJZING
      );

      zoekParameters.push(...FilterUtils.getZoekParameterFromFilter(omgevingsnormen, 'omgevingsnorm.identificatie'));

      zoekParameters.push(...FilterUtils.getZoekParameterFromFilter(omgevingswaarden, 'omgevingswaarde.identificatie'));

      zoekParameters.push(
        ...FilterUtils.getZoekParameterFromFilter(gebiedsaanwijzingen, 'gebiedsaanwijzing.identificatie')
      );
    }

    zoekParameters.push(
      ...FilterUtils.getZoekParametersFromRegelgevingtype(filterOptions[FilterName.REGELGEVING_TYPE], url)
    );

    return zoekParameters;
  }
}
