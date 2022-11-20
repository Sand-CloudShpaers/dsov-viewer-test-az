import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';
import * as DivisieannotatieActions from './divisieannotatie.actions';
import { DivisieannotatieEffects } from './divisieannotatie.effects';

describe('DivisieannotatieEffects', () => {
  let spectator: SpectatorService<DivisieannotatieEffects>;
  let actions$: Observable<Action>;
  const createService = createServiceFactory({
    service: DivisieannotatieEffects,
    providers: [provideMockActions(() => actions$), provideMockStore({ initialState })],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('shouldLoadDivisieannotatieForElement', () => {
    it('should load divisieannotatie', done => {
      actions$ = of(
        DivisieannotatieActions.openedDivisieannotatieForElement({
          documentId: 'documentId',
          documentstructuurelementId: 'documentstructuurelementId',
          href: 'divisieHref',
          isOntwerp: false,
        })
      );

      spectator.service.shouldLoadDivisieannotatieForElement$.subscribe(actual => {
        const expected = DivisieannotatieActions.loadDivisieannotatie({
          documentstructuurelementId: 'documentstructuurelementId',
          href: 'divisieHref',
          isOntwerp: false,
        });

        expect(actual).toEqual(expected);
        done();
      });
    });
  });
});
