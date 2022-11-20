import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ErrorHandlingService } from '~services/error-handling.service';
import { GegevenscatalogusHttpClient } from './gegevenscatalogus.http-client';

describe('test gegevenscatalogus http client', () => {
  let service: GegevenscatalogusHttpClient;
  let httpClient: HttpClient;
  let errorHandlingService: ErrorHandlingService;

  beforeEach(() => {
    httpClient = {
      get: () => of(''),
      post: () => of(''),
    } as any;

    errorHandlingService = {
      handleApiCallError$: (_observable: unknown, _apiName: unknown, defaultValue: unknown) => of(defaultValue),
    } as any;

    service = new GegevenscatalogusHttpClient(httpClient, errorHandlingService);
  });

  it('create headers', () => {
    expect(GegevenscatalogusHttpClient.makeHeaders().get('Accept')).withContext('headers not set').toEqual('*/*');
  });

  it('handle a get call with options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.get$('some/fake/url', { responseOnError: 'hello there', headers: new HttpHeaders() }).subscribe(success => {
      expect(success).toEqual('hello there');
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a get call without options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    const successSpy = jasmine.createSpy('success');
    const failureSpy = jasmine.createSpy('failure');

    service.get$('some/fake/url').subscribe({ next: successSpy, error: failureSpy });
    tick();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(successSpy).toHaveBeenCalledTimes(1);
    expect(failureSpy).toHaveBeenCalledTimes(0);
    expect(successSpy).toHaveBeenCalledWith(undefined);
  }));
});
