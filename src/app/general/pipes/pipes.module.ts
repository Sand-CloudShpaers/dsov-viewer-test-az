import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlUtilPipe } from './safe-html-util.pipe';
import { CapitalizePipe } from '~general/pipes/capitalize.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CapitalizePipe, SafeHtmlUtilPipe],
  exports: [CapitalizePipe, SafeHtmlUtilPipe],
})
export class PipesModule {}
