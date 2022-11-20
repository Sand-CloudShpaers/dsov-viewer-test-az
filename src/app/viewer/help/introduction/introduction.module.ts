import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './introduction.component';
import { IntroductionService } from './introduction.service';
import { CmsContentModule } from '~viewer/help/cms-content/cms-content.module';
import { HelpModalModule } from '../help-modal/help-modal.module';

@NgModule({
  imports: [CommonModule, CmsContentModule, HelpModalModule],
  declarations: [IntroductionComponent],
  exports: [IntroductionComponent],
  providers: [IntroductionService],
})
export class IntroductionModule {}
