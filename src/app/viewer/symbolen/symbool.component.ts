import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-symbool',
  templateUrl: './symbool.component.html',
})
export class SymboolComponent {
  @Input() public symboolcode: string;
}
