import { TestBed } from '@angular/core/testing';

import { DisableMapClickService } from './disable-map-click.service';

import { cold } from 'jasmine-marbles';

describe('DisableMapClickService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisableMapClickService],
    });
  });

  it('awesomely useful unit test', done => {
    const service = TestBed.inject(DisableMapClickService);
    const expectedFalse$ = cold('a', { a: false });
    const expectedTrue$ = cold('a', { a: true });

    expect(service).toBeTruthy();
    service.enable();

    expect(service.popupEnabled$).toBeObservable(expectedTrue$);

    service.disable();

    expect(service.popupEnabled$).toBeObservable(expectedFalse$);

    service.enable();

    expect(service.popupEnabled$).toBeObservable(expectedTrue$);

    service.close$.subscribe(() => {
      done();
    });
    service.close();
  });
});
