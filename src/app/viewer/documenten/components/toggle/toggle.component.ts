import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-toggle',
  templateUrl: './toggle.component.html',
})
export class ToggleComponent {
  @Input()
  public showToggle: boolean;

  @Input()
  public isOpen: boolean;
}
