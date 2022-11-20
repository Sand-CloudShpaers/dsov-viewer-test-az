import { createAction, props } from '@ngrx/store';
import { ReleaseNotesVM } from '../types/release-notes.model';

export const getReleaseNotes = createAction('[Release notes] Get Release Notes');
export const loadReleaseNotes = createAction('[Release notes] Load Release Notes');
export const loadReleaseNotesSuccess = createAction(
  '[Release notes in side panel] Load Release Notes Success',
  props<{ releaseNotes: ReleaseNotesVM }>()
);
export const loadReleaseNotesFailure = createAction(
  '[Release notes in side panel] Load Release Notes Failure',
  props<{ error?: Error }>()
);
