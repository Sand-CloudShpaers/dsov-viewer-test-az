import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiUtils } from '~general/utils/api.utils';
import { PostBodyOzon } from '~general/utils/filter.utils';
import { ConfigService } from '~services/config.service';
import { ErrorHandlingService } from '~services/error-handling.service';
import { TimeTravelQueryParams } from '~store/common/navigation/types/query-params';
import { OzonHttpClientOptions } from './ozon-http-client-options';
import { GeoJSONGeometry, GeoJSONGeometryCollection } from 'ol/format/GeoJSON';

type SpatialOperator = 'intersects' | 'within' | 'contains';

export interface GeoJsonZoekObject {
  geometrie: GeoJSONGeometry | GeoJSONGeometryCollection;
  spatialOperator: SpatialOperator;
}

@Injectable()
export class OzonHttpClient {
  public readonly serviceNaam = 'OZON';

  constructor(
    private httpClient: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private configService: ConfigService,
    private route: ActivatedRoute
  ) {}

  public requestOptions<T>(
    contentGeometry: boolean,
    acceptGeometry: boolean,
    responseOnError?: T | null,
    contentTypeEmbeddedXML = false
  ): OzonHttpClientOptions<T> {
    const headers = this.headerParameters(contentGeometry, acceptGeometry, contentTypeEmbeddedXML);
    return { headers, withCredentials: false, responseOnError };
  }

  public get$<T>(url: string, options: OzonHttpClientOptions<T>): Observable<T> {
    return this.httpClient
      .get<T>(
        ApiUtils.addTimeTravelAsQueryParamStringForOzon(url, {
          geldigOp: this.route.snapshot.queryParams[TimeTravelQueryParams.DATE],
        }),
        options
      )
      .pipe(o => this.handleError$(o, options));
  }

  public post$<T>(url: string, body: PostBodyOzon, options: OzonHttpClientOptions<T>): Observable<T> {
    return this.httpClient
      .post<T>(
        ApiUtils.addTimeTravelAsQueryParamStringForOzon(url, {
          geldigOp: this.route.snapshot.queryParams[TimeTravelQueryParams.DATE],
        }),
        body,
        options
      )
      .pipe(o => this.handleError$(o, options));
  }

  private handleError$<T>(obs: Observable<T>, options: OzonHttpClientOptions<T>): Observable<T> {
    return obs.pipe(o =>
      this.errorHandlingService.handleApiCallError$<T>(o, this.serviceNaam, options.responseOnError)
    );
  }

  private headerParameters(
    contentGeometry: boolean,
    acceptGeometry: boolean,
    contentTypeEmbeddedXML: boolean
  ): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json, application/hal+json');
    headers = headers.append('x-api-key', this.configService.config.ozon.apiKey);
    if (contentGeometry) {
      headers = headers.append('Content-CRS', 'EPSG:28992');
    }
    if (acceptGeometry) {
      headers = headers.append('Accept-CRS', 'EPSG:28992');
    }
    if (contentTypeEmbeddedXML) {
      headers = headers.append('Content-Type-Embedded', 'application/xml');
    } else {
      headers = headers.append('Content-Type', 'application/json');
    }
    return headers;
  }
}
