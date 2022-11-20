import { HttpHeaders } from '@angular/common/http';

export interface OzonHttpClientOptions<T> {
  headers?: HttpHeaders;
  /**
   * default response when a http error occurs
   *
   * @TODO add types for response on error
   */
  responseOnError?: T | null;
  withCredentials?: boolean;
}
