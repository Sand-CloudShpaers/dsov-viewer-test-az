import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NoCacheHeaders } from '~services/no-cache-headers';
import { ReleaseNotesVM } from '../types/release-notes.model';

@Injectable()
export class ReleaseNotesService {
  constructor(private http: HttpClient) {}

  public getReleaseNotes$(): Observable<ReleaseNotesVM> {
    return this.http.get('assets/release-notes.json', { headers: NoCacheHeaders }) as Observable<ReleaseNotesVM>;
  }
}
