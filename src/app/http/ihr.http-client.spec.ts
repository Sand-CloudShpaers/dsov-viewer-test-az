import { HttpClient, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConfigService } from '~services/config.service';
import { ErrorHandlingService } from '~services/error-handling.service';
import { IhrHttpClient } from './ihr.http-client';

describe('ihr.http.client', () => {
  let service: IhrHttpClient;
  let httpClient: HttpClient;
  let errorHandlingService: ErrorHandlingService;
  let config: ConfigService;

  beforeEach(() => {
    httpClient = {
      get: () => of(''),
      post: () => of(''),
    } as any;

    errorHandlingService = {
      handleApiCallError$: (_observable: unknown, _apiName: unknown, defaultValue: unknown) => of(defaultValue),
    } as any;

    config = {
      config: {
        ihr: {
          url: 'test',
          apiKey: 'test',
        },
      },
    } as ConfigService;

    service = new IhrHttpClient(httpClient, errorHandlingService, config);
  });

  it('handle a get call with options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.get$('some/fake/url', { headers: new HttpHeaders() }).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a get call without options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();
    service.get$('some/fake/url', null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a get call without options 2', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.get$('some/fake/url', null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a get call without options.reponseOnError ', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.get$('some/fake/url', null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a get call without options.reponseOnError 2', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.get$('some/fake/url', null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a post call with options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.post$('some/fake/url', null, { headers: new HttpHeaders() }).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a post call without options', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.post$('some/fake/url', null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a post call without options 2', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.post$('some/fake/url', null, null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a post call without options.reponseOnError ', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.post$('some/fake/url', null, null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('handle a post call without options.reponseOnError 2', fakeAsync(() => {
    const errorSpy = spyOn(errorHandlingService, 'handleApiCallError$').and.callThrough();

    service.post$('some/fake/url', null, null).subscribe(success => {
      expect(success).toEqual({});
    });
    tick();

    expect(errorSpy.calls.count()).toEqual(1);
  }));

  it('should contain accept', () => {
    expect(service.requestOptions(false, false).headers.get('Accept')).toEqual('*/*');
    expect(service.requestOptions(true, false).headers.get('Accept')).toEqual('*/*');
    expect(service.requestOptions(true, true).headers.get('Accept')).toEqual('*/*');
    expect(service.requestOptions(false, true).headers.get('Accept')).toEqual('*/*');
  });

  it('should contain content crs', () => {
    expect(service.requestOptions(true, false).headers.get('Content-Crs'))
      .withContext('headers not set')
      .toEqual('epsg:28992');
  });

  it('should not contain content crs', () => {
    expect(service.requestOptions(false, false).headers.get('Content-Crs')).toBeNull();
  });

  it('should contain Accept crs', () => {
    expect(service.requestOptions(false, true).headers.get('Accept-Crs'))
      .withContext('headers not set')
      .toEqual('epsg:28992');
  });

  it('should not contain Accept crs', () => {
    expect(service.requestOptions(false, false).headers.get('Accept-Crs')).toBeNull();
  });
});
