import { initialState, reducer as releaseNotesReducer, State } from './release-notes.reducer';
import * as ReleaseNotesActions from './release-notes.actions';
import { LoadingState } from '~model/loading-state.enum';

describe('releaseNotesReducer', () => {
  const testId = 'release-notes';
  const releaseNotesMock = {
    releases: [{ version: 'x', date: '31-12-2021', richContent: '<div>Mocked release notes</div>' }],
  };

  const loadState: State = {
    ids: [testId],
    entities: {
      [testId]: {
        status: LoadingState.PENDING,
        entityId: testId,
      },
    },
    error: null,
  } as State;

  const loadSuccessState: State = {
    ids: [testId],
    entities: {
      [testId]: {
        data: {
          releaseNotes: releaseNotesMock,
        },
        status: LoadingState.RESOLVED,
        entityId: testId,
      },
    },
    error: null,
  } as State;

  const releaseNotesError = new Error('failure');
  const loadFailedState: State = {
    ids: [testId],
    entities: {
      [testId]: {
        status: LoadingState.REJECTED,
        entityId: testId,
        error: releaseNotesError,
      },
    },
    error: null,
  } as State;

  it('should have initial state', () => {
    const action = {};
    const actual = releaseNotesReducer(undefined, action as any);

    expect(actual).toEqual(initialState);
  });

  it('should track loadstatus', () => {
    const action = ReleaseNotesActions.loadReleaseNotes();
    const actual = releaseNotesReducer(initialState, action);

    expect(actual).toEqual(loadState);
  });

  it('should set loadingstate on loadReleaseNotes success', () => {
    const action = ReleaseNotesActions.loadReleaseNotesSuccess({
      releaseNotes: releaseNotesMock,
    });
    const actual = releaseNotesReducer(initialState, action);

    expect(actual).toEqual(loadSuccessState);
  });

  it('should set loadingstate on loadReleaseNotes failure', () => {
    const action = ReleaseNotesActions.loadReleaseNotesFailure({
      error: releaseNotesError,
    });
    const actual = releaseNotesReducer(initialState, action);

    expect(actual).toEqual(loadFailedState);
  });
});
