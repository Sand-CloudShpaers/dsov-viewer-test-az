import { HttpHeaders } from '@angular/common/http';

export interface CmsHttpClientOptions<T> {
  headers?: HttpHeaders;
  responseOnError?: T;
  responseType?: any; // eslint-disable-line
}
