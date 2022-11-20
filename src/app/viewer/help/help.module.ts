import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './help.component';
import { ContactinfoModule } from './contactinfo/contactinfo.module';
import { IntroductionModule } from './introduction/introduction.module';

@NgModule({
  imports: [CommonModule, ContactinfoModule, IntroductionModule],
  declarations: [HelpComponent],
  exports: [HelpComponent],
})
export class HelpModule {}
