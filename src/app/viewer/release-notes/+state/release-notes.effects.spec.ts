import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import * as ReleaseNotesActions from './release-notes.actions';
import { ReleaseNotesService } from '../services/release-notes.service';
import { ReleaseNotesEffects } from './release-notes.effects';
import { provideMockStore } from '@ngrx/store/testing';
import initialState from '~mocks/initial-state';

describe('ReleaseNotesEffects Empty Store', () => {
  let spectator: SpectatorService<ReleaseNotesEffects>;
  let actions$: Observable<Action>;
  let releaseNotesService: SpyObject<ReleaseNotesService>;
  const localState = {
    ...initialState,
    common: {
      'release-notes': {
        entities: {},
      },
    },
  };

  const createService = createServiceFactory({
    service: ReleaseNotesEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: localState,
      }),
    ],
    mocks: [ReleaseNotesService],
  });

  beforeEach(() => {
    spectator = createService();
    releaseNotesService = spectator.inject(ReleaseNotesService);
  });

  describe('getReleaseNotes (not yet in store)', () => {
    it('should trigger loadReleaseNotes', () => {
      actions$ = of(ReleaseNotesActions.getReleaseNotes());
      spectator.service.getReleaseNotes$.subscribe(fromAction => {
        expect(fromAction).toEqual(ReleaseNotesActions.loadReleaseNotes());
      });
    });
  });

  describe('loadReleaseNotes', () => {
    it('should trigger loadReleaseNotesSuccess', () => {
      const releaseNotesMock = {
        releases: [{ version: 'x', date: '31-12-2021', richContent: '<div>Mocked release notes</div>' }],
      };
      releaseNotesService.getReleaseNotes$.and.returnValue(of(releaseNotesMock));
      actions$ = of(ReleaseNotesActions.loadReleaseNotes());
      spectator.service.loadReleaseNotes$.subscribe(fromAction => {
        expect(fromAction).toEqual(ReleaseNotesActions.loadReleaseNotesSuccess({ releaseNotes: releaseNotesMock }));
      });
    });

    it('should trigger loadReleaseNotesFailure', () => {
      const releaseNotesError = new Error('failure');
      releaseNotesService.getReleaseNotes$.and.returnValue(throwError(() => releaseNotesError));

      actions$ = of(ReleaseNotesActions.loadReleaseNotes());
      spectator.service.loadReleaseNotes$.subscribe(fromAction => {
        expect(fromAction).toEqual(ReleaseNotesActions.loadReleaseNotesFailure({ error: releaseNotesError }));
      });
    });
  });
});

describe('ReleaseNotesEffects Release Notes already in store', () => {
  let spectator: SpectatorService<ReleaseNotesEffects>;
  let actions$: Observable<Action>;
  const mockReleases = {
    releases: [
      { version: '1.1.0', date: '2021/10/20', richContent: 'Allerlei klussen' },
      { version: '1.2.0', date: '2021/10/21', richContent: 'Allerlei fixes' },
    ],
  };
  const localState = {
    ...initialState,
    common: {
      'release-notes': {
        entities: {
          'release-notes': {
            data: {
              releaseNotes: mockReleases,
            },
            entityId: 'release-notes',
            status: 'RESOLVED',
          },
        },
      },
    },
  };

  const createService = createServiceFactory({
    service: ReleaseNotesEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: localState,
      }),
    ],
    mocks: [ReleaseNotesService],
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('getReleaseNotes (already in store)', () => {
    it('should trigger loadReleaseNotesSuccess', () => {
      actions$ = of(ReleaseNotesActions.getReleaseNotes());
      spectator.service.getReleaseNotes$.subscribe(fromAction => {
        expect(fromAction).toEqual(ReleaseNotesActions.loadReleaseNotesSuccess({ releaseNotes: mockReleases }));
      });
    });
  });
});
