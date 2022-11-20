import { TestBed } from '@angular/core/testing';

import { ReleaseNotesService } from './release-notes.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReleaseNotesService', () => {
  let service: ReleaseNotesService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReleaseNotesService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ReleaseNotesService);
  });

  it('should get release notes config', () => {
    service.getReleaseNotes$().subscribe(releaseNotes => {
      expect(releaseNotes.releases.length).toBeGreaterThan(0);
    });
  });
});
