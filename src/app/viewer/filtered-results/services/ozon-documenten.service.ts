import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';
import { ApiSource } from '~model/internal/api-source';
import { State } from '~store/state';
import { OzonProvider } from '~providers/ozon.provider';
import { FilterIdentification, FilterName, FilterOptions } from '~viewer/filter/types/filter-options';
import * as PlannenActions from '../+state/plannen/plannen.actions';
import { LOCATIE_ID_TYPE, LocatieIdType } from '~general/utils/filter.utils';
import { DocumentType } from '~viewer/documenten/types/document-types';

export const activiteitZoekUrl = '/activiteiten/_zoek';
export const gebiedsaanwijzingZoekUrl = '/gebiedsaanwijzingen/_zoek';
export const omgevingsnormZoekUrl = '/omgevingsnormen/_zoek';
export const omgevingswaardeZoekUrl = '/omgevingswaarden/_zoek';
export const documentregeltekstZoekUrl = '/regelingen/regels/_zoek';
export const documentvrijetekstZoekUrl = '/regelingen/tekstdelen/_zoek';
export const ontwerpDocumentregeltekstZoekUrl = '/ontwerpregelingen/regels/_zoek';
export const ontwerpDocumentvrijetekstZoekUrl = '/ontwerpregelingen/tekstdelen/_zoek';
export const regeltekstZoekUrl = '/regelteksten/_zoek';
export const ontwerpRegeltekstZoekUrl = '/ontwerpregelteksten/_zoek';

@Injectable()
export class OzonDocumentenService {
  constructor(private provider: OzonProvider, private store: Store<State>) {}

  public loadOzonDocumenten$(
    ozonLocaties: string[],
    filterOptions: FilterOptions,
    loadMore: boolean
  ): Observable<[Regeling[], Regeling[], Omgevingsvergunning[]]> {
    return forkJoin([
      this.loadRegeltekstDocumenten$(ozonLocaties, filterOptions, loadMore),
      this.loadVrijeTekstDocumenten$(ozonLocaties, filterOptions, loadMore),
      this.loadOmgevingsvergunningen$(ozonLocaties, filterOptions, loadMore),
    ]);
  }

  public loadOzonOntwerpDocumenten$(
    locatieIdtype: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions,
    loadMore: boolean
  ): Observable<[OntwerpRegeling[], OntwerpRegeling[]]> {
    return forkJoin([
      this.loadOntwerpRegeltekstDocumenten$(locatieIdtype, locatieIds, filterOptions, loadMore),
      this.loadOntwerpVrijetekstDocumenten$(locatieIdtype, locatieIds, filterOptions),
    ]);
  }

  public loadOmgevingsvergunningen$(
    ozonLocaties: string[],
    filterOptions: FilterOptions,
    loadMore: boolean
  ): Observable<Omgevingsvergunning[]> {
    const documenttypes = filterOptions[FilterName.DOCUMENT_TYPE];
    // Wordt er gefilterd op type document én wordt er NIET gefilterd op omgevingsvergunning
    // dan ook geen omgevingsvergunningen ophalen
    if (
      documenttypes.length &&
      !documenttypes.some(documenttype => documenttype.id === DocumentType.omgevingsvergunning)
    ) {
      return of([]);
    }
    return this.provider
      .fetchOmgevingsvergunningen$(ozonLocaties, 0, 0)
      .pipe(
        tap(result => {
          if (loadMore) {
            this.dispatchLoadMoreOmgevingsvergunnningen(result._links?.next?.href, ozonLocaties, filterOptions);
          }
        })
      )
      .pipe(map(response => response._embedded?.omgevingsvergunningen || []));
  }

  public loadRegeltekstDocumenten$(
    ozonLocaties: string[],
    filterOptions: FilterOptions,
    loadMore: boolean
  ): Observable<Regeling[]> {
    filterOptions = this.filterDocumenttypes(filterOptions);
    if (!filterOptions || this.hasCorrectDocumentTypes(filterOptions[FilterName.DOCUMENT_TYPE])) {
      return of([]);
    }
    return this.provider
      .fetchRegelingen$(ozonLocaties, filterOptions, documentregeltekstZoekUrl)
      .pipe(
        tap(result => {
          if (loadMore) {
            this.dispatchLoadMore(result._links?.next?.href, ozonLocaties, filterOptions);
          }
        })
      )
      .pipe(map(response => response._embedded?.regelingen || []));
  }

  public loadOntwerpRegeltekstDocumenten$(
    locatieIdtype: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions,
    loadMore: boolean
  ): Observable<OntwerpRegeling[]> {
    filterOptions = this.filterDocumenttypes(filterOptions);
    if (
      !filterOptions ||
      this.hasCorrectDocumentTypes(filterOptions[FilterName.DOCUMENT_TYPE]) ||
      (locatieIdtype === LOCATIE_ID_TYPE.OntwerplocatieTechnischId && locatieIds.length === 0) // Voorkom 400
    ) {
      return of([]);
    }
    return this.provider
      .fetchOntwerpRegelingen$(locatieIdtype, locatieIds, filterOptions, ontwerpDocumentregeltekstZoekUrl)
      .pipe(
        tap(result => {
          if (loadMore) {
            this.dispatchLoadMoreOntwerpRegeltekstDocumenten(
              result._links?.next?.href,
              locatieIdtype,
              locatieIds,
              filterOptions
            );
          }
        })
      )
      .pipe(map(response => response._embedded?.ontwerpRegelingen || []));
  }

  public loadVrijeTekstDocumenten$(
    ozonLocaties: string[],
    filterOptions: FilterOptions,
    loadMore: boolean
  ): Observable<Regeling[]> {
    filterOptions = this.filterDocumenttypes(filterOptions);
    if (filterOptions && filterOptions[FilterName.REGELGEVING_TYPE]?.length) {
      delete filterOptions[FilterName.REGELGEVING_TYPE];
    }
    if (
      !filterOptions ||
      filterOptions.activiteit?.length > 0 ||
      this.hasCorrectDocumentTypes(filterOptions[FilterName.DOCUMENT_TYPE])
    ) {
      return of([]);
    }
    return this.provider
      .fetchRegelingen$(ozonLocaties, filterOptions, documentvrijetekstZoekUrl)
      .pipe(
        tap(result => {
          if (loadMore) {
            this.dispatchLoadMore(result._links?.next?.href, ozonLocaties, filterOptions);
          }
        })
      )
      .pipe(map(response => response._embedded?.regelingen || []));
  }

  public loadOntwerpVrijetekstDocumenten$(
    locatieIdtype: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): Observable<OntwerpRegeling[]> {
    filterOptions = this.filterDocumenttypes(filterOptions);
    if (
      !filterOptions ||
      filterOptions.activiteit?.length > 0 ||
      this.hasCorrectDocumentTypes(filterOptions[FilterName.DOCUMENT_TYPE]) ||
      (locatieIdtype === LOCATIE_ID_TYPE.OntwerplocatieTechnischId && locatieIds.length === 0) // Voorkom 400
    ) {
      return of([]);
    }
    return this.provider
      .fetchOntwerpRegelingen$(locatieIdtype, locatieIds, filterOptions, ontwerpDocumentvrijetekstZoekUrl)
      .pipe(
        tap(result =>
          this.dispatchLoadMoreOntwerpVrijetekstDocumenten(
            result._links?.next?.href,
            locatieIdtype,
            locatieIds,
            filterOptions
          )
        )
      )
      .pipe(map(response => response._embedded?.ontwerpRegelingen || []));
  }

  public loadMore$(fetchUrl: string, ozonLocaties: string[], filterOptions: FilterOptions): Observable<Regeling[]> {
    return this.provider
      .fetchRegelingenByUrl$(fetchUrl, ozonLocaties, filterOptions)
      .pipe(tap(result => this.dispatchLoadMore(result._links?.next?.href, ozonLocaties, filterOptions)))
      .pipe(map(result => result._embedded.regelingen));
  }

  public loadMoreOntwerp$(
    fetchUrl: string,
    locatieIdType: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): Observable<OntwerpRegeling[]> {
    return this.provider
      .fetchOntwerpRegelingenByUrl$(fetchUrl, locatieIdType, locatieIds, filterOptions)
      .pipe(
        tap(result =>
          this.dispatchLoadMoreOntwerpVrijetekstDocumenten(
            result._links?.next?.href,
            locatieIdType,
            locatieIds,
            filterOptions
          )
        )
      )
      .pipe(map(result => result._embedded.ontwerpRegelingen));
  }

  public loadMoreOmgevingsvergunningen$(
    fetchUrl: string,
    ozonLocaties: string[],
    filterOptions: FilterOptions
  ): Observable<Omgevingsvergunning[]> {
    return this.provider
      .fetchOmgevingsvergunnningenByUrl$(fetchUrl, ozonLocaties, filterOptions)
      .pipe(
        tap(result =>
          this.dispatchLoadMoreOmgevingsvergunnningen(result._links?.next?.href, ozonLocaties, filterOptions)
        )
      )
      .pipe(map(result => result._embedded.omgevingsvergunningen));
  }

  private hasCorrectDocumentTypes(documenttypes: FilterIdentification[]): boolean {
    if (documenttypes?.length > 0) {
      return !documenttypes.some(documenttype => documenttype.applicableToSources.includes(ApiSource.OZON));
    }
    return false;
  }

  private filterDocumenttypes(filterOptions: FilterOptions): FilterOptions {
    const omgevingsvergunning = filterOptions.document_type.find(type => type.id === 'omgevingsvergunning');
    const filtered = filterOptions.document_type.filter(type => type !== omgevingsvergunning);

    if (omgevingsvergunning && !filtered.length) {
      return null;
    }
    return { ...filterOptions, document_type: filtered };
  }

  private dispatchLoadMore(fetchUrl: string, ozonLocaties: string[], filterOptions: FilterOptions): void {
    if (fetchUrl) {
      this.store.dispatch(PlannenActions.ozonLoadMore({ fetchUrl, ozonLocaties, filterOptions }));
    }
  }

  private dispatchLoadMoreOntwerpVrijetekstDocumenten(
    fetchUrl: string,
    locatieIdType: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): void {
    if (fetchUrl) {
      this.store.dispatch(
        PlannenActions.ozonOntwerpLoadMore({
          fetchUrl,
          locatieIdType,
          locatieIds,
          filterOptions,
        })
      );
    }
  }

  private dispatchLoadMoreOntwerpRegeltekstDocumenten(
    fetchUrl: string,
    locatieIdType: LocatieIdType,
    locatieIds: string[],
    filterOptions: FilterOptions
  ): void {
    if (fetchUrl) {
      this.store.dispatch(
        PlannenActions.ozonOntwerpLoadMore({
          fetchUrl,
          locatieIdType,
          locatieIds,
          filterOptions,
        })
      );
    }
  }

  private dispatchLoadMoreOmgevingsvergunnningen(
    fetchUrl: string,
    ozonLocaties: string[],
    filterOptions: FilterOptions
  ): void {
    if (fetchUrl) {
      this.store.dispatch(
        PlannenActions.ozonOmgevingsvergunningLoadMore({
          fetchUrl,
          ozonLocaties,
          filterOptions,
        })
      );
    }
  }
}
