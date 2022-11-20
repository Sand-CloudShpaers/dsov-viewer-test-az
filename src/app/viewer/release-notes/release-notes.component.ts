import { DatePipe } from '@angular/common';
import '@angular/common/locales/global/nl';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from '~store/common/index';
import { Release, ReleaseNotesVM } from './types/release-notes.model';
import * as fromReleaseNotes from './+state/release-notes.selectors';
import { releaseNotesEntityId } from './+state/release-notes.reducer';
import { VersionNumberService } from '~viewer/components/version-number/version-number.service';
import { getReleaseNotes } from '~viewer/release-notes/+state/release-notes.actions';

@Component({
  selector: 'dsov-release-notes',
  templateUrl: './release-notes.component.html',
})
export class ReleaseNotesComponent implements OnInit {
  public releaseNotes$: Observable<ReleaseNotesVM>;
  private buildVersionDate: Date;

  constructor(
    private store: Store<State>,
    private versionNumberService: VersionNumberService,
    private datePipe: DatePipe
  ) {
    this.releaseNotes$ = this.store.select(fromReleaseNotes.getReleaseNotesVM(releaseNotesEntityId));
  }

  ngOnInit(): void {
    this.store.dispatch(getReleaseNotes());
    this.buildVersionDate = this.versionNumberService.getBuildVersionDate();
  }

  public filterByVersionDate(release: Release): boolean {
    return this.buildVersionDate >= new Date(release.date);
  }

  public getHandleTitle(release: Release): string {
    return `${release.version} - ${this.datePipe.transform(release.date, 'longDate', undefined, 'nl_NL')}`;
  }

  public trackByFn(_index: number, item: Release): string {
    return item.version;
  }
}
