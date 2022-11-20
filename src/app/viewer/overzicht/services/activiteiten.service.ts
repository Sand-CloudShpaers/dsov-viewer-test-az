import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Activiteiten } from '~ozon-model/activiteiten';
import { OzonHttpClient } from '~http/ozon.http-client';
import { ConfigService } from '~services/config.service';
import { State } from '~store/state';
import { activiteitZoekUrl } from '~viewer/filtered-results/services/ozon-documenten.service';
import { FilterName } from '~viewer/filter/types/filter-options';
import { FilterUtils, LOCATIE_ID_TYPE } from '~general/utils/filter.utils';

@Injectable()
export class ActiviteitenService {
  constructor(
    private ozonHTTPClient: OzonHttpClient,
    private configService: ConfigService,
    private store: Store<State>
  ) {}

  public getActiviteiten$(
    ozonLocaties: string[],
    url = `${this.configService.config.ozon.url}${activiteitZoekUrl}?page=0&size=${this.configService.ozonMaxResponseSize}`
  ): Observable<Activiteiten> {
    return this.ozonHTTPClient.post$<Activiteiten>(
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
