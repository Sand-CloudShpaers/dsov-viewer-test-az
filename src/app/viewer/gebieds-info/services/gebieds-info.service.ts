import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Gebiedsaanwijzingen } from '~ozon-model/gebiedsaanwijzingen';
import { Omgevingsnormen } from '~ozon-model/omgevingsnormen';
import { Omgevingswaarden } from '~ozon-model/omgevingswaarden';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService } from '~services/config.service';
import { State } from '~store/state';
import {
  gebiedsaanwijzingZoekUrl,
  omgevingsnormZoekUrl,
  omgevingswaardeZoekUrl,
} from '~viewer/filtered-results/services/ozon-documenten.service';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilterUtils, LOCATIE_ID_TYPE } from '~general/utils/filter.utils';

@Injectable()
export class GebiedsInfoService {
  constructor(
    private ozonHTTPClient: OzonHttpClient,
    private configService: ConfigService,
    private store: Store<State>
  ) {}

  public getGebiedsaanwijzingen$(
    ozonLocaties: string[],
    url = `${this.configService.config.ozon.url}${gebiedsaanwijzingZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`
  ): Observable<Gebiedsaanwijzingen> {
    return this.ozonHTTPClient.post$<Gebiedsaanwijzingen>(
      url,
      FilterUtils.getPostBodyOzonFromFilters(
        LOCATIE_ID_TYPE.locatieIdentificatie,
        ozonLocaties,
        {
          [FilterName.ACTIVITEIT]: [],
          [FilterName.DOCUMENT_TYPE]: [],
          [FilterName.REGELGEVING_TYPE]: [],
          [FilterName.THEMA]: [],
        },
        url
      ),
      this.ozonHTTPClient.requestOptions(false, true)
    );
  }

  public getOmgevingswaarden$(
    ozonLocaties: string[],
    url = `${this.configService.config.ozon.url}${omgevingswaardeZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`
  ): Observable<Omgevingswaarden> {
    return this.ozonHTTPClient.post$<Omgevingswaarden>(
      url,
      FilterUtils.getPostBodyOzonFromFilters(
        LOCATIE_ID_TYPE.locatieIdentificatie,
        ozonLocaties,
        {
          [FilterName.ACTIVITEIT]: [],
          [FilterName.DOCUMENT_TYPE]: [],
          [FilterName.REGELGEVING_TYPE]: [],
          [FilterName.THEMA]: [],
        },
        url
      ),
      this.ozonHTTPClient.requestOptions(true, true)
    );
  }

  public getOmgevingsnormen$(
    ozonLocaties: string[],
    url = `${this.configService.config.ozon.url}${omgevingsnormZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}&_expand=true&_expandScope=locaties`
  ): Observable<Omgevingsnormen> {
    return this.ozonHTTPClient.post$<Omgevingsnormen>(
      url,
      FilterUtils.getPostBodyOzonFromFilters(
        LOCATIE_ID_TYPE.locatieIdentificatie,
        ozonLocaties,
        {
          [FilterName.ACTIVITEIT]: [],
          [FilterName.DOCUMENT_TYPE]: [],
          [FilterName.REGELGEVING_TYPE]: [],
          [FilterName.THEMA]: [],
        },
        url
      ),
      this.ozonHTTPClient.requestOptions(true, true)
    );
  }
}
