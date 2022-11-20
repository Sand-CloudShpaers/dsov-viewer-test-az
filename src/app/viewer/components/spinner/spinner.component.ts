import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-spinner',
  templateUrl: './spinner.component.html',
})
export class SpinnerComponent {
  @Input()
  public label?: string;

  @Input()
  public size = 'dsov-medium';
}
