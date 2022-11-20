import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { ActiviteitenEffects } from '~viewer/overzicht/activiteiten/+state/activiteiten.effects';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import initialState from '~mocks/initial-state';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromActiviteitenMock from './activiteiten.mock';
import * as ActiviteitenActions from '~viewer/overzicht/activiteiten/+state/activiteiten.actions';
import { ActiviteitenService } from '~viewer/overzicht/services/activiteiten.service';

describe('ActiviteitenEffects', () => {
  let spectator: SpectatorService<ActiviteitenEffects>;
  let actions$: Observable<Action>;
  let activiteitenService: SpyObject<ActiviteitenService>;

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
    service: ActiviteitenEffects,
    providers: [provideMockStore({ initialState: localInitialState }), provideMockActions(() => actions$)],
    mocks: [ActiviteitenService],
  });

  beforeEach(() => {
    spectator = createService();
    activiteitenService = spectator.inject(ActiviteitenService);
  });

  describe('loadActiviteiten', () => {
    it('should handle successfull api response', done => {
      activiteitenService.getActiviteiten$.and.returnValue(of(fromActiviteitenMock.mockActiviteitenResponse));
      actions$ = of(ActiviteitenActions.loadingActiviteiten({ activiteiten: [] }));

      spectator.service.loadingActiviteiten$.subscribe(actual => {
        const expected = ActiviteitenActions.loadActiviteitenSuccess({
          activiteiten: fromActiviteitenMock.mockActiviteitenResponse._embedded.activiteiten,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle successfull api response, with load more', done => {
      activiteitenService.getActiviteiten$.and.returnValue(
        of({
          ...fromActiviteitenMock.mockActiviteitenResponse,
          _links: {
            next: {
              href: 'href',
            },
          },
        })
      );

      actions$ = of(ActiviteitenActions.loadingActiviteiten({ activiteiten: [] }));

      spectator.service.loadingActiviteiten$.subscribe(actual => {
        const expected = ActiviteitenActions.loadingActiviteiten({
          activiteiten: fromActiviteitenMock.mockActiviteitenResponse._embedded.activiteiten,
          href: 'href',
        });

        expect(actual).toEqual(expected);
        done();
      });
    });

    it('should handle failed api response', done => {
      const error = new Error('stuk');
      activiteitenService.getActiviteiten$.and.returnValue(throwError(() => error));
      actions$ = of(ActiviteitenActions.loadingActiviteiten({ activiteiten: [] }));

      spectator.service.loadingActiviteiten$.subscribe(actual => {
        expect(actual).toEqual(ActiviteitenActions.loadActiviteitenFailure({ error }));
        done();
      });
    });
  });
});
