import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'dsov-thema-tile',
  templateUrl: './thema-tile.component.html',
})
export class ThemaTileComponent {
  @Input() public name: string;
  @Input() public icon: string;

  @Output() handleClick: EventEmitter<void> = new EventEmitter();

  public onClick(): boolean {
    this.handleClick.emit();
    return false;
  }
}
