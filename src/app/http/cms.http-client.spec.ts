import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ErrorHandlingService } from '~services/error-handling.service';
import { CmsHttpClient } from './cms.http-client';

describe('test Cms http client', () => {
  let service: CmsHttpClient;
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

    service = new CmsHttpClient(httpClient, errorHandlingService);
  });

  it('create headers', () => {
    expect(CmsHttpClient.makeHeaders().get('Accept')).withContext('headers not set').toEqual('*/*');
  });

  it('handle a get call with options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    const successSpy = jasmine.createSpy('success');
    const failureSpy = jasmine.createSpy('failure');

    service
      .get$('some/fake/url', { responseOnError: 'hello there', headers: new HttpHeaders() })
      .subscribe({ next: successSpy, error: failureSpy });
    tick();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(successSpy).toHaveBeenCalledTimes(1);
    expect(failureSpy).toHaveBeenCalledTimes(0);
    expect(successSpy).toHaveBeenCalledWith('hello there');
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
