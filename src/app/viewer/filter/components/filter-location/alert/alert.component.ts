import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-search-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() error: Error;
}
