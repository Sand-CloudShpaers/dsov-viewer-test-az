import { Component, Input } from '@angular/core';

@Component({
  selector: 'dsov-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss'],
})
export class HelpModalComponent {
  @Input() public title: string;

  public modalOpen = false;

  public open(): void {
    this.modalOpen = true;
  }

  public onCloseclicked(): void {
    this.modalOpen = false;
  }
}
