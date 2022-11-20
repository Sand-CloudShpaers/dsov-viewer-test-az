import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GebiedsaanwijzingVM } from '~viewer/gebiedsaanwijzingen/types/gebiedsaanwijzingenVM';

@Component({
  selector: 'dsov-overzicht-gebieden-gebied',
  templateUrl: './overzicht-gebieden-gebied.component.html',
  styleUrls: ['./overzicht-gebieden-gebied.component.scss'],
})
export class OverzichtGebiedenGebiedComponent {
  @Input() gebied: GebiedsaanwijzingVM;
  @Output() public clickElement = new EventEmitter<GebiedsaanwijzingVM>();
}
