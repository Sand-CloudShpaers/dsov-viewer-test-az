import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formattedDate } from '~general/utils/date.utils';

export interface DatePickerDetail {
  value: string;
  valueAsDate: Date;
  error?: string;
}

@Component({
  selector: 'dsov-date-picker-container',
  templateUrl: './date-picker-container.component.html',
  styleUrls: ['./date-picker-container.component.scss'],
})
export class DatePickerContainerComponent {
  @Input() public label = 'Datum';
  @Input() public min: Date;
  @Input() public max: Date;
  @Input() public value: Date;
  @Input() public identifier = 'datum';
  @Input() public showRequiredError = false;
  @Output() dateChanged = new EventEmitter<DatePickerDetail>();

  public detail: DatePickerDetail;
  public showError = false;
  public errorMessage: string;

  public setDetail(event: Event): void {
    this.showError = false;
    this.detail = (event as CustomEvent).detail;
    if (!this.detail.error) {
      this.handleInput();
    }
  }

  public handleInput(): void {
    this.showError = false;
    if (this.detail) {
      if (this.detail.error === 'invalid') {
        this.showError = true;
        this.errorMessage = 'Vul de datum in met de juiste notatie (dd-mm-jjjj).';
      } else if (!!this.min && this.detail.error === 'min-range') {
        this.showError = true;
        this.errorMessage = `De datum ligt voor ${this.getDateFormatted(
          this.min
        )}. Vul een datum in op of na ${this.getDateFormatted(this.min)}.`;
      } else if (!!this.max && this.detail.error === 'max-range') {
        this.showError = true;
        this.errorMessage = `De datum ligt na ${formattedDate(this.max)}. Vul een datum in voor of op ${formattedDate(
          this.max
        )}.`;
      }

      this.dateChanged.emit(this.detail);
    }
  }

  public getDateFormatted(date: Date): string {
    return date ? `${formattedDate(date)}` : '';
  }
}
