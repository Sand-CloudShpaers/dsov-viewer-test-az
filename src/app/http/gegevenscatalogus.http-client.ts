import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorHandlingService } from '~services/error-handling.service';
import { GegevenscatalogusClientOptions } from './gegevenscatalogus-client-options';

@Injectable({ providedIn: 'root' })
export class GegevenscatalogusHttpClient {
  public readonly serviceNaam = 'Gegevenscatalogus';

  constructor(private httpClient: HttpClient, private errorHandlingService: ErrorHandlingService) {}

  public static makeHeaders(): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Accept', '*/*');
    return headers;
  }

  public get$<T>(url: string, options: GegevenscatalogusClientOptions<T> = {}): Observable<T> {
    options = GegevenscatalogusHttpClient.processOptions(options);

    return this.httpClient.get<T>(url, options).pipe(o => this.handleError$(o, options));
  }

  private static processOptions<T>(options: GegevenscatalogusClientOptions<T>): GegevenscatalogusClientOptions<T> {
    if (options.headers == null) {
      options.headers = GegevenscatalogusHttpClient.makeHeaders();
    }

    return options;
  }

  private handleError$<T>(obs: Observable<T>, options: GegevenscatalogusClientOptions<T>): Observable<T> {
    return obs.pipe(o =>
      this.errorHandlingService.handleApiCallError$<T>(o, this.serviceNaam, options.responseOnError)
    );
  }
}
