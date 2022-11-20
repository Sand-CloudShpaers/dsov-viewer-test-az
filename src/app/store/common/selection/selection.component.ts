import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'dsov-slider',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent {
  @Input()
  public identifier: string;

  @Input()
  public checked?: boolean = false;

  @Input()
  public tooltips?: {
    active: string;
    inactive: string;
  };

  @Output()
  public sliderChange = new EventEmitter<{ checked: boolean; id: string }>();

  @Input()
  public isDisabled? = false;

  public elementId: string;

  constructor() {
    this.elementId = `${this.identifier}-${uuidv4()}`;
  }

  public isChecked(event: MatSlideToggleChange): void {
    this.sliderChange.emit({ checked: event.checked, id: this.identifier });
    this.checked = event.checked;
  }
}
