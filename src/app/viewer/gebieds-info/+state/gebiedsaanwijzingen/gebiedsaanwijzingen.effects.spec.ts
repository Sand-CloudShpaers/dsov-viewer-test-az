import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import initialState from '~mocks/initial-state';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as GebiedsaanwijzingenActions from './gebiedsaanwijzingen.actions';
import { GebiedsaanwijzingenEffects } from './gebiedsaanwijzingen.effects';
import { mockGebiedsaanwijzingenResponse } from './gebiedsaanwijzingen.mock';
import { GebiedsInfoService } from '~viewer/gebieds-info/services/gebieds-info.service';

describe('GebiedsaanwijzingenEffects', () => {
  let spectator: SpectatorService<GebiedsaanwijzingenEffects>;
  let actions$: Observable<Action>;
  let gebiedsInfoService: SpyObject<GebiedsInfoService>;

  const localInitialState = {
    ...initialState,
    common: {
      ozonLocaties: {
        locatieIds: [
          {
            identificatie: 'nl.imow-mnre1034.gebiedengroep.201912011101024',
            locatieType: 'Gebiedengroep',
            procedurestatus: 'vastgesteld',
          },
        ],
      },
    },
  } as any;

  const createService = createServiceFactory({
    service: GebiedsaanwijzingenEffects,
    providers: [provideMockStore({ initialState: localInitialState }), provideMockActions(() => actions$)],
    mocks: [GebiedsInfoService],
  });

  beforeEach(() => {
    spectator = createService();
    gebiedsInfoService = spectator.inject(GebiedsInfoService);
  });

  describe('loadGebiedsaanwijzingen', () => {
    it('should handle successfull api response', done => {
      gebiedsInfoService.getGebiedsaanwijzingen$.and.returnValue(of(mockGebiedsaanwijzingenResponse));
      actions$ = of(GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({ gebiedsaanwijzingen: {} }));

      spectator.service.loadGebiedsaanwijzingen$.subscribe(actual => {
        const expected = GebiedsaanwijzingenActions.loadGebiedsaanwijzingenSuccess({
          gebiedsaanwijzingen: mockGebiedsaanwijzingenResponse._embedded,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle successfull api response, with load more', done => {
      gebiedsInfoService.getGebiedsaanwijzingen$.and.returnValue(
        of({
          ...mockGebiedsaanwijzingenResponse,
          _links: {
            next: {
              href: 'href',
            },
          },
        })
      );

      actions$ = of(GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({ gebiedsaanwijzingen: {} }));

      spectator.service.loadGebiedsaanwijzingen$.subscribe(actual => {
        const expected = GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({
          gebiedsaanwijzingen: mockGebiedsaanwijzingenResponse._embedded,
          href: 'href',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('stuk');
      gebiedsInfoService.getGebiedsaanwijzingen$.and.returnValue(throwError(() => error));
      actions$ = of(GebiedsaanwijzingenActions.loadGebiedsaanwijzingen({ gebiedsaanwijzingen: {} }));

      spectator.service.loadGebiedsaanwijzingen$.subscribe(actual => {
        expect(actual).toEqual(GebiedsaanwijzingenActions.loadGebiedsaanwijzingenFailure({ error }));
        done();
      });
    });
  });
});
