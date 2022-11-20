import { Component, EventEmitter, Output } from '@angular/core';
import { ViewerPage } from '~store/common/navigation/types/application-page';
import { FilterName } from '~viewer/filter/types/filter-options';

export interface FilterConfirmationOptions {
  name: FilterName;
  title: string;
  message: string;
  toBeDeletedFilter: FilterName;
  page?: ViewerPage;
}

@Component({
  selector: 'dsov-filter-confirmation',
  templateUrl: './filter-confirmation.component.html',
  styleUrls: ['./filter-confirmation.component.scss'],
})
export class FilterConfirmationComponent {
  @Output() public approved = new EventEmitter<FilterConfirmationOptions>();
  @Output() public canceled = new EventEmitter<FilterName>();

  public show: boolean;
  public options: FilterConfirmationOptions;

  public confirm(options: FilterConfirmationOptions): void {
    this.options = options;
    this.open();
  }

  public approve(): void {
    this.approved.emit(this.options);
    this.close();
  }

  public cancel(): void {
    this.canceled.emit(this.options?.name);
    this.close();
  }

  public open(): void {
    this.show = true;
  }

  public close(): void {
    this.show = false;
  }
}
