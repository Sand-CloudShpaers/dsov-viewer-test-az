import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { VersionNumberService } from './version-number.service';
import { closeOverlay, showApplicationInfo } from '~viewer/overlay/+state/overlay.actions';

@Component({
  selector: 'dsov-version-number',
  templateUrl: './version-number.component.html',
  styleUrls: ['./version-number.component.scss'],
})
export class VersionNumberComponent implements OnInit {
  public versionNr: string;

  constructor(private store: Store<State>, private versionNumberService: VersionNumberService) {}

  public ngOnInit(): void {
    this.versionNr = this.versionNumberService.getBuildVersionNumber();
  }

  public showApplicationInfo(): void {
    this.store.dispatch(closeOverlay());
    this.store.dispatch(showApplicationInfo());
  }
}
