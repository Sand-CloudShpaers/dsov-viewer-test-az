import { HttpClient } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConfigFactory } from '~mocks/config-factory';
import { ConfigService } from './config.service';
import * as configMock from './config.service.mock';

describe('ConfigService', () => {
  let service: ConfigService;
  let httpClient: HttpClient;

  beforeEach(() => {
    const configJson = ConfigFactory.createConfig();
    httpClient = {
      get: () => of(configJson),
    } as any;
    service = new ConfigService(httpClient);
  });

  it('should fetch configuration', fakeAsync(() => {
    service = new ConfigService(httpClient);
    service.load();
    tick();

    expect(service.config).toEqual(configMock.config);
  }));
});
