import { HttpHeaders } from '@angular/common/http';

export interface GegevenscatalogusClientOptions<T> {
  headers?: HttpHeaders;
  responseOnError?: T;
}
