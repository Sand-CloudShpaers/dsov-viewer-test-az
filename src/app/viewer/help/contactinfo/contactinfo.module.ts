import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactinfoComponent } from './contactinfo.component';
import { ContactinfoService } from './contactinfo.service';
import { CmsContentModule } from '~viewer/help/cms-content/cms-content.module';

@NgModule({
  imports: [CommonModule, CmsContentModule],
  declarations: [ContactinfoComponent],
  exports: [ContactinfoComponent],
  providers: [ContactinfoService],
})
export class ContactinfoModule {}
