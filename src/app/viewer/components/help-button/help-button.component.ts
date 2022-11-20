import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '~store/state';
import { closeOverlay, showHelp } from '~viewer/overlay/+state/overlay.actions';

@Component({
  selector: 'dsov-help-button',
  templateUrl: './help-button.component.html',
})
export class HelpButtonComponent {
  constructor(private store: Store<State>) {}

  public showHelp(): void {
    this.store.dispatch(closeOverlay());
    this.store.dispatch(showHelp());
  }
}
