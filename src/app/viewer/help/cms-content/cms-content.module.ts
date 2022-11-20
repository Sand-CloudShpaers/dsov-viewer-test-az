import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentComponent } from './cms-content.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CmsContentComponent],
  exports: [CmsContentComponent],
})
export class CmsContentModule {}
