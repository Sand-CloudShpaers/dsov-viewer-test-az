import * as fromReleaseNotes from './release-notes.selectors';
import { ReleaseNotesVM } from '../types/release-notes.model';

describe('ReleaseNotes Selectors', () => {
  describe('getReleaseNotesVM', () => {
    it('should return undefined', () => {
      expect(fromReleaseNotes.getReleaseNotesVM('test').projector({})).toEqual(undefined);
      expect(fromReleaseNotes.getReleaseNotesVM('test').projector({ test: {} })).toEqual(undefined);
      expect(fromReleaseNotes.getReleaseNotesVM('test').projector({ test: { data: {} } })).toEqual(undefined);
    });

    it('should return release notes', () => {
      const mockReleaseNotes: ReleaseNotesVM = { releases: [{ version: 'a', date: 'b', richContent: 'c' }] };

      expect(
        fromReleaseNotes.getReleaseNotesVM('test').projector({ test: { data: { releaseNotes: mockReleaseNotes } } })
      ).toEqual(mockReleaseNotes);
    });
  });
});
