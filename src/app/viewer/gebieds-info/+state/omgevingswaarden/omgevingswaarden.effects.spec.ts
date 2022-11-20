import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import initialState from '~mocks/initial-state';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as OmgevingswaardenActions from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.actions';
import { OmgevingswaardenEffects } from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.effects';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';
import { mockOmgevingswaardenResponse } from '~viewer/gebieds-info/+state/omgevingswaarden/omgevingswaarden.mock';

describe('OmgevingswaardenEffects', () => {
  let spectator: SpectatorService<OmgevingswaardenEffects>;
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
    service: OmgevingswaardenEffects,
    providers: [provideMockStore({ initialState: localInitialState }), provideMockActions(() => actions$)],
    mocks: [GebiedsInfoService],
  });

  beforeEach(() => {
    spectator = createService();
    gebiedsInfoService = spectator.inject(GebiedsInfoService);
  });

  describe('loadOmgevingswaarden', () => {
    it('should handle successfull api response', done => {
      gebiedsInfoService.getOmgevingswaarden$.and.returnValue(of(mockOmgevingswaardenResponse));
      actions$ = of(OmgevingswaardenActions.loadOmgevingswaarden({ omgevingswaarden: [] }));

      spectator.service.loadOmgevingswaarden$.subscribe(actual => {
        const expected = OmgevingswaardenActions.loadOmgevingswaardenSuccess({
          omgevingswaarden: mockOmgevingswaardenResponse._embedded.omgevingswaarden,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle successfull api response, with load more', done => {
      gebiedsInfoService.getOmgevingswaarden$.and.returnValue(
        of({
          ...mockOmgevingswaardenResponse,
          _links: {
            next: {
              href: 'href',
            },
          },
        })
      );

      actions$ = of(OmgevingswaardenActions.loadOmgevingswaarden({ omgevingswaarden: [] }));

      spectator.service.loadOmgevingswaarden$.subscribe(actual => {
        const expected = OmgevingswaardenActions.loadOmgevingswaarden({
          omgevingswaarden: mockOmgevingswaardenResponse._embedded.omgevingswaarden,
          href: 'href',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('stuk');
      gebiedsInfoService.getOmgevingswaarden$.and.returnValue(throwError(() => error));
      actions$ = of(OmgevingswaardenActions.loadOmgevingswaarden({ omgevingswaarden: [] }));

      spectator.service.loadOmgevingswaarden$.subscribe(actual => {
        const expected = OmgevingswaardenActions.loadOmgevingswaardenFailure({ error });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
