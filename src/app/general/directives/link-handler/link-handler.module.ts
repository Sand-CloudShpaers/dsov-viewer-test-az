import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkHandlerDirective } from './link-handler.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [LinkHandlerDirective],
  exports: [LinkHandlerDirective],
})
export class LinkHandlerModule {}
