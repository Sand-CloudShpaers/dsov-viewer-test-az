import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import initialState from '~mocks/initial-state';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';
import * as OmgevingsnormenActions from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.actions';
import { OmgevingsnormenEffects } from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.effects';
import {
  mockOmgevingsnormenResponse,
  omgevingsnormenMock,
} from '~viewer/gebieds-info/+state/omgevingsnormen/omgevingsnormen.mock';

describe('OmgevingsnormenEffects', () => {
  let spectator: SpectatorService<OmgevingsnormenEffects>;
  let actions$: Observable<Action>;
  let gebiedsInfoService: SpyObject<GebiedsInfoService>;

  const localInitialState = {
    ...initialState,
    common: {
      ozonLocaties: {
        locatieIds: ['nl.imow-mnre1034.gebiedengroep.201912011101024'],
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: OmgevingsnormenEffects,
    providers: [provideMockStore({ initialState: localInitialState }), provideMockActions(() => actions$)],
    mocks: [GebiedsInfoService],
  });

  beforeEach(() => {
    spectator = createService();
    gebiedsInfoService = spectator.inject(GebiedsInfoService);
  });

  describe('loadOmgevingsnormen', () => {
    it('should load omgevingsnormen', done => {
      actions$ = of(OmgevingsnormenActions.loadOmgevingsnormen({ omgevingsnormen: omgevingsnormenMock }));

      spectator.service.loadOmgevingsnormen$.subscribe(actual => {
        const expected = OmgevingsnormenActions.loadingOmgevingsnormen({
          omgevingsnormen: omgevingsnormenMock,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle successfull api response', done => {
      gebiedsInfoService.getOmgevingsnormen$.and.returnValue(of(mockOmgevingsnormenResponse));
      actions$ = of(OmgevingsnormenActions.loadingOmgevingsnormen({ omgevingsnormen: [] }));

      spectator.service.loadingOmgevingsnormen$.subscribe(actual => {
        const expected = OmgevingsnormenActions.loadOmgevingsnormenSuccess({
          omgevingsnormen: mockOmgevingsnormenResponse._embedded.omgevingsnormen,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle successfull api response, with load more', done => {
      gebiedsInfoService.getOmgevingsnormen$.and.returnValue(
        of({
          ...mockOmgevingsnormenResponse,
          _links: {
            next: {
              href: 'href',
            },
          },
        })
      );

      actions$ = of(OmgevingsnormenActions.loadingOmgevingsnormen({ omgevingsnormen: [] }));

      spectator.service.loadingOmgevingsnormen$.subscribe(actual => {
        const expected = OmgevingsnormenActions.loadOmgevingsnormen({
          omgevingsnormen: mockOmgevingsnormenResponse._embedded.omgevingsnormen,
          href: 'href',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('stuk');
      gebiedsInfoService.getOmgevingsnormen$.and.returnValue(throwError(() => error));
      actions$ = of(OmgevingsnormenActions.loadingOmgevingsnormen({ omgevingsnormen: [] }));

      spectator.service.loadingOmgevingsnormen$.subscribe(actual => {
        const expected = OmgevingsnormenActions.loadOmgevingsnormenFailure({ error });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
