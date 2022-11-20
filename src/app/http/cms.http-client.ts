import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlingService } from '~services/error-handling.service';
import { CmsHttpClientOptions } from './cms-http-client-options';

@Injectable()
export class CmsHttpClient {
  public readonly serviceNaam = 'CMS';

  constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService) {}

  public static makeHeaders(): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Accept', '*/*');
    return headers;
  }

  public get$<T>(url: string, options: CmsHttpClientOptions<T> = {}): Observable<T> {
    options = CmsHttpClient.processOptions(options);

    return this.httpClient.get<T>(url, options).pipe(o => this.handleError$(o, options));
  }

  private static processOptions<T>(options: CmsHttpClientOptions<T>): CmsHttpClientOptions<T> {
    if (options.headers == null) {
      options.headers = CmsHttpClient.makeHeaders();
    }

    return options;
  }

  private handleError$<T>(obs: Observable<T>, options: CmsHttpClientOptions<T>): Observable<T> {
    return obs.pipe(o =>
      this.errorHandlingService.handleApiCallError$<T>(o, this.serviceNaam, options.responseOnError)
    );
  }
}
