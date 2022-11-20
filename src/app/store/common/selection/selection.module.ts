import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionComponent } from './selection.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [CommonModule, MatSlideToggleModule, MatTooltipModule],
  declarations: [SelectionComponent],
  exports: [SelectionComponent],
})
export class SelectionModule {}
