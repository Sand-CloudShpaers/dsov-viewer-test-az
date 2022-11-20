import { NgModule } from '@angular/core';
import { SymboolComponent } from '~viewer/symbolen/symbool.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SymboolComponent],
  exports: [SymboolComponent],
  imports: [CommonModule],
})
export class SymbolenModule {}
