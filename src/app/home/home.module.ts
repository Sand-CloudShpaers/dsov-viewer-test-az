import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '~general/pipes/pipes.module';
import { HomeComponent } from '~home/home.component';
import { FaqComponent } from '~home/faq/faq.component';
import { FaqService } from '~home/faq/services/faq.service';
import { IhrDisabledModule } from '~general/components/ihr-disabled/ihr-disabled.module';

@NgModule({
  imports: [CommonModule, RouterModule, PipesModule, IhrDisabledModule],
  declarations: [HomeComponent, FaqComponent],
  exports: [HomeComponent],
  providers: [FaqService],
})
export class HomeModule {}
