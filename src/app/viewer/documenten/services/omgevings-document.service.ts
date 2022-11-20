import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { ZoekParameters } from '~general/utils/filter.utils';
import { ActiviteitLocatieaanduidingen } from '~ozon-model/activiteitLocatieaanduidingen';
import { Kaarten } from '~ozon-model/kaarten';
import { Hoofdlijnen } from '~ozon-model/hoofdlijnen';
import { OntwerpRegeling } from '~ozon-model/ontwerpRegeling';
import { Regeling } from '~ozon-model/regeling';
import { Regelingen } from '~ozon-model/regelingen';
import { Regelteksten } from '~ozon-model/regelteksten';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService } from '~services/config.service';
import { getEscapedDocumentId } from '~viewer/documenten/utils/document-utils';
import { OntwerpRegelteksten } from '~ozon-model/ontwerpRegelteksten';
import { OntwerpActiviteitLocatieaanduidingen } from '~ozon-model/ontwerpActiviteitLocatieaanduidingen';
import { OntwerpHoofdlijnen } from '~ozon-model/ontwerpHoofdlijnen';
import { Divisieannotaties } from '~ozon-model/divisieannotaties';
import { OntwerpDivisieannotaties } from '~ozon-model/ontwerpDivisieannotaties';
import { ontwerpRegeltekstZoekUrl, regeltekstZoekUrl } from '~viewer/filtered-results/services/ozon-documenten.service';
import { ActiviteitLocatieaanduidingZoekParameter } from '~ozon-model/activiteitLocatieaanduidingZoekParameter';
import { OntwerpActiviteitLocatieaanduidingZoekParameter } from '~ozon-model/ontwerpActiviteitLocatieaanduidingZoekParameter';
import { TimeTravelDates } from '~model/time-travel-dates';
import { ApiUtils } from '~general/utils/api.utils';
import { Omgevingsvergunning } from '~ozon-model/omgevingsvergunning';

export const divisieannotatiesUrl = '/divisieannotaties/_zoek';
export const ontwerpdivisieannotatiesUrl = '/ontwerpdivisieannotaties/_zoek';

@Injectable()
export class OmgevingsDocumentService {
  constructor(private ozonHTTPClient: OzonHttpClient, private configService: ConfigService) {}

  public get$<T>(url: string): Observable<T> {
    if (!url) {
      return of(null);
    }
    const options = this.ozonHTTPClient.requestOptions(
      false,
      false,
      null,
      url.includes('/documentcomponenten') || url.includes('/ontwerpdocumentcomponenten')
    );
    return this.ozonHTTPClient.get$<T>(url, options);
  }

  public post$<T>(zoekParameters: ZoekParameters[], url: string): Observable<T> {
    if (!url) {
      return of(null);
    }
    return this.ozonHTTPClient.post$<T>(url, { zoekParameters }, this.ozonHTTPClient.requestOptions(false, false));
  }

  public getRegeling$(documentId: string, timeTravelDates: TimeTravelDates): Observable<Regeling> {
    const options = this.ozonHTTPClient.requestOptions<Regeling>(false, false);
    const url = ApiUtils.addTimeTravelAsQueryParamStringForOzon(
      `${this.configService.config.ozon.url}/regelingen/${getEscapedDocumentId(documentId)}`,
      timeTravelDates
    );
    return this.ozonHTTPClient.get$<Regeling>(url, options);
  }

  public getOntwerpRegeling$(documentId: string): Observable<OntwerpRegeling> {
    const options = this.ozonHTTPClient.requestOptions<OntwerpRegeling>(false, false);
    return this.ozonHTTPClient.get$<OntwerpRegeling>(
      `${this.configService.config.ozon.url}/ontwerpregelingen/${getEscapedDocumentId(documentId)}`,
      options
    );
  }

  public getOmgevingsvergunning$(
    documentId: string,
    timeTravelDates: TimeTravelDates
  ): Observable<Omgevingsvergunning> {
    const options = this.ozonHTTPClient.requestOptions<Omgevingsvergunning>(false, false);
    const url = ApiUtils.addTimeTravelAsQueryParamStringForOzon(
      `${this.configService.config.ozon.url}/omgevingsvergunningen/${getEscapedDocumentId(documentId)}`,
      timeTravelDates
    );
    return this.ozonHTTPClient.get$<Omgevingsvergunning>(url, options);
  }

  public getOmgevingsDocumenten$(
    zoekParameters: ZoekParameters[],
    regelsUrl: string,
    tekstdelenUrl: string
  ): Observable<[Regelingen, Regelingen]> {
    return forkJoin([
      this.getRegelingenRegels$(zoekParameters, regelsUrl),
      this.getRegelingenTekstdelen$(zoekParameters, tekstdelenUrl),
    ]);
  }

  public getRegelingenRegels$(zoekParameters: ZoekParameters[], url: string): Observable<Regelingen> {
    if (this.hasCorrectRegeltekstZoekParameters(zoekParameters) && url) {
      return this.ozonHTTPClient.post$<Regelingen>(
        url,
        { zoekParameters },
        this.ozonHTTPClient.requestOptions(true, true, null)
      );
    }
    return of(null);
  }

  public getRegelingenTekstdelen$(zoekParameters: ZoekParameters[], url: string): Observable<Regelingen> {
    if (this.hasCorrectDivisieannotatieZoekParameters(zoekParameters) && url) {
      return this.ozonHTTPClient.post$<Regelingen>(
        url,
        { zoekParameters },
        this.ozonHTTPClient.requestOptions(true, true, null)
      );
    }
    return of(null);
  }

  public getDocumentHoofdlijnen$(zoekParameters: ZoekParameters[]): Observable<Hoofdlijnen> {
    return this.ozonHTTPClient.post$<Hoofdlijnen>(
      `${this.configService.config.ozon.url}/hoofdlijnen/_zoek?page=0&size=${this.configService.ozonMaxResponseSize}`,
      { zoekParameters },
      this.ozonHTTPClient.requestOptions(false, false)
    );
  }

  public getOntwerpDocumentHoofdlijnen$(zoekParameters: ZoekParameters[]): Observable<OntwerpHoofdlijnen> {
    return this.ozonHTTPClient.post$<OntwerpHoofdlijnen>(
      `${this.configService.config.ozon.url}/ontwerphoofdlijnen/_zoek?page=0&size=${this.configService.ozonMaxResponseSize}`,
      { zoekParameters },
      this.ozonHTTPClient.requestOptions(false, false)
    );
  }

  public getRegelteksten$(zoekParameters: ZoekParameters[]): Observable<Regelteksten> {
    if (this.hasCorrectRegeltekstZoekParameters(zoekParameters)) {
      return this.ozonHTTPClient.post$<Regelteksten>(
        `${this.configService.config.ozon.url}${regeltekstZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}&sort=volgordeNummer,asc`,
        { zoekParameters },
        this.ozonHTTPClient.requestOptions(false, false)
      );
    }
    return of(null);
  }

  public getOntwerpRegelteksten$(zoekParameters: ZoekParameters[], url?: string): Observable<OntwerpRegelteksten> {
    if (this.hasCorrectRegeltekstZoekParameters(zoekParameters)) {
      return this.ozonHTTPClient.post$<OntwerpRegelteksten>(
        url ||
          `${this.configService.config.ozon.url}${ontwerpRegeltekstZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}&sort=volgordeNummer,asc`,
        { zoekParameters },
        this.ozonHTTPClient.requestOptions(false, false)
      );
    }
    return of(null);
  }

  public getDivisieannotaties$(zoekParameters: ZoekParameters[]): Observable<Divisieannotaties> {
    if (this.hasCorrectDivisieannotatieZoekParameters(zoekParameters)) {
      return this.ozonHTTPClient.post$<Divisieannotaties>(
        `${this.configService.config.ozon.url}${divisieannotatiesUrl}?page=0&size=${this.configService.ozonMaxResponseSize}&sort=volgordeNummer,asc`,
        { zoekParameters },
        this.ozonHTTPClient.requestOptions(false, false)
      );
    }
    return of(null);
  }

  public getOntwerpDivisieannotaties$(
    zoekParameters: ZoekParameters[],
    url?: string
  ): Observable<OntwerpDivisieannotaties> {
    if (this.hasCorrectDivisieannotatieZoekParameters(zoekParameters)) {
      return this.ozonHTTPClient.post$<OntwerpDivisieannotaties>(
        url ||
          `${this.configService.config.ozon.url}${ontwerpdivisieannotatiesUrl}?page=0&size=${this.configService.ozonMaxResponseSize}&sort=volgordeNummer,asc`,
        { zoekParameters },
        this.ozonHTTPClient.requestOptions(false, false)
      );
    }
    return of(null);
  }

  public getDocumentKaarten$(
    zoekParameters: ZoekParameters[],
    url = `${this.configService.config.ozon.url}/kaarten/_zoek?page=0&size=${this.configService.ozonMaxResponseSize}`
  ): Observable<Kaarten> {
    return this.ozonHTTPClient.post$<Kaarten>(
      url,
      { zoekParameters },
      this.ozonHTTPClient.requestOptions(false, false)
    );
  }

  public getActiviteitLocatieaanduidingen$(regeltekstIdentificatie: string): Observable<ActiviteitLocatieaanduidingen> {
    return this.ozonHTTPClient.post$<ActiviteitLocatieaanduidingen>(
      `${this.configService.config.ozon.url}/activiteitlocatieaanduidingen/_zoek?page=0&size=${this.configService.ozonMaxResponseSize}`,
      {
        zoekParameters: [
          {
            parameter: ActiviteitLocatieaanduidingZoekParameter.ParameterEnum.RegeltekstIdentificatie,
            zoekWaarden: [regeltekstIdentificatie],
          },
        ],
      },
      this.ozonHTTPClient.requestOptions(true, true, null)
    );
  }

  public getOntwerpActiviteitLocatieaanduidingen$(
    technischId: string
  ): Observable<OntwerpActiviteitLocatieaanduidingen> {
    return technischId
      ? this.ozonHTTPClient.post$<OntwerpActiviteitLocatieaanduidingen>(
          `${this.configService.config.ozon.url}/ontwerpactiviteitlocatieaanduidingen/_zoek?page=0&size=${this.configService.ozonMaxResponseSize}`,
          {
            zoekParameters: [
              {
                parameter: OntwerpActiviteitLocatieaanduidingZoekParameter.ParameterEnum.OntwerpregeltekstTechnischId,
                zoekWaarden: [technischId],
              },
            ],
          },
          this.ozonHTTPClient.requestOptions(true, true, null)
        )
      : of(null);
  }

  private hasCorrectRegeltekstZoekParameters(zoekParameters: ZoekParameters[]): boolean {
    const excludedParameters = ['hoofdlijn.identificatie'];
    return (
      zoekParameters.filter(
        zoekParameter => !excludedParameters.includes(zoekParameter.parameter) && zoekParameter.zoekWaarden.length
      ).length === zoekParameters.length
    );
  }

  private hasCorrectDivisieannotatieZoekParameters(zoekParameters: ZoekParameters[]): boolean {
    const excludedParameters = [
      'activiteit.identificatie',
      'omgevingsnorm.identificatie',
      'omgevingswaarde.identificatie',
      'regeltekst.type',
    ];
    return (
      zoekParameters.filter(
        zoekParameter => !excludedParameters.includes(zoekParameter.parameter) && zoekParameter.zoekWaarden.length
      ).length === zoekParameters.length
    );
  }
}
