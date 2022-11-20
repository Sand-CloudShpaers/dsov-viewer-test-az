import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dsov-kaartdetails-button',
  templateUrl: './kaartdetails-button.component.html',
  styleUrls: ['./kaartdetails-button.component.scss'],
})
export class KaartdetailsButtonComponent {
  @Output() public showMapPanel: EventEmitter<void> = new EventEmitter<void>();

  public showKaartdetails(): void {
    this.showMapPanel.next();
  }
}
