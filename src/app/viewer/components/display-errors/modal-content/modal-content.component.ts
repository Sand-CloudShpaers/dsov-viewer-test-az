import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayErrorMessage } from '~model/display-error-message';

@Component({
  selector: 'dsov-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
})
export class ModalContentComponent {
  @Input() public errorMessages: DisplayErrorMessage[];
  @Output() public closeEventEmitter = new EventEmitter<void>();

  public openText = false;

  public closeModal(): void {
    this.closeEventEmitter.next();
  }

  public toggleDetails(error: DisplayErrorMessage): void {
    error.showinfo = !error.showinfo;
  }

  public trackByMessage(_index: number, item: DisplayErrorMessage): string {
    return item.message;
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
