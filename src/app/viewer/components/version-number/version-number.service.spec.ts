import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { VersionNumberService } from './version-number.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('VersionNumberService', () => {
  let service: VersionNumberService;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = {
      get: () => of('123 2021-03-08T08:00:00Z'),
    } as any;
    service = new VersionNumberService(httpClient);
  });

  describe('loadVersion', () => {
    it('should load version config', async () => {
      service.loadVersion().then(version => {
        expect(version).toEqual('123 2021-03-08T08:00:00Z');
      });
    });
  });

  describe('getBuildversion', () => {
    it('should return the full build version', fakeAsync(() => {
      service.loadVersion();
      tick();

      expect(service.getBuildVersion()).toEqual('123 2021-03-08T08:00:00Z');
    }));
  });

  describe('getBuildversionNumber', () => {
    it('should return the build version number', fakeAsync(() => {
      service.loadVersion();
      tick();

      expect(service.getBuildVersionNumber()).toEqual('123');
    }));
  });

  describe('getBuildversionDate', () => {
    it('should return the build version date', fakeAsync(() => {
      service.loadVersion();
      tick();

      expect(service.getBuildVersionDate()).toEqual(new Date('2021-03-08T08:00:00Z'));
    }));
  });
});
