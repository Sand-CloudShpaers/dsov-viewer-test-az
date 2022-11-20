import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoJSONGeometry } from 'ol/format/GeoJSON';
import { Observable } from 'rxjs';
import { ConfigService } from '~services/config.service';
import { ErrorHandlingService } from '~services/error-handling.service';
import { IhrHttpClientOptions } from './ihr-http-client-options';

export interface PostBodyIHR {
  _geo?: {
    intersects?: GeoJSONGeometry;
    intersectAndNotTouches?: GeoJSONGeometry;
  };
  ids?: string[];
}

@Injectable()
export class IhrHttpClient {
  public readonly serviceNaam = 'Informatiehuis Ruimte';

  constructor(
    private httpClient: HttpClient,
    private errorHandlingService: ErrorHandlingService,
    private configService: ConfigService
  ) {}

  public requestOptions(contentGeometry: boolean, acceptGeometry: boolean): IhrHttpClientOptions {
    return { headers: this.headerParameters(contentGeometry, acceptGeometry) };
  }

  public get$<T>(url: string, options: IhrHttpClientOptions): Observable<T> {
    return this.httpClient.get<T>(url, options || {}).pipe(o => this.handleError$(o));
  }

  public post$<T>(url: string, body: PostBodyIHR, options: IhrHttpClientOptions = {}): Observable<T> {
    return this.httpClient.post<T>(url, body, options || {}).pipe(o => this.handleError$(o));
  }

  private handleError$<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(o => this.errorHandlingService.handleApiCallError$<T>(o, this.serviceNaam, {} as T));
  }

  private headerParameters(contentGeometry: boolean, acceptGeometry: boolean): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('accept', '*/*');
    headers = headers.append('x-api-key', this.configService.config.ihr.apiKey);
    if (contentGeometry) {
      headers = headers.append('content-crs', 'epsg:28992');
    }
    if (acceptGeometry) {
      headers = headers.append('accept-crs', 'epsg:28992');
    }
    return headers;
  }
}
