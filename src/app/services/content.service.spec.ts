import { ContentService } from './content.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ContentService', () => {
  let service: ContentService;
  let httpClient: HttpClient;
  const contentJson = { a: 'b' };

  beforeEach(() => {
    httpClient = {
      get: () => of(contentJson),
    } as any;
    service = new ContentService(httpClient);
  });

  describe('load', () => {
    it('should load content', done => {
      service
        .load()
        .then(content => {
          expect(content).toEqual(contentJson);
          done();
        })
        .catch(done.fail);
    });
  });

  describe('getRichContent', () => {
    it('should get content', done => {
      service
        .load()
        .then(_ => {
          expect(service.getRichContent('a')).toEqual('b');
          done();
        })
        .catch(done.fail);
    });

    it('should return empty string content is undefined', () => {
      expect(service.getRichContent('not_found')).toEqual('');
    });

    it('should return empty string if not found', () => {
      expect(service.getRichContent('not_found')).toEqual('');
    });
  });
});

describe('ContentService without content', () => {
  let service: ContentService;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = {
      get: () => of(undefined),
    } as any;
    service = new ContentService(httpClient);
  });

  describe('getRichContent when content is undefined', () => {
    it('should return empty string content is undefined', () => {
      expect(service.getRichContent('not_found')).toEqual('');
    });
  });
});
