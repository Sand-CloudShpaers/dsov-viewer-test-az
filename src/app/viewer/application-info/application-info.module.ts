import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '~general/pipes/pipes.module';
import { ApplicationInfoComponent } from './components/application-info.component';
import { SpinnerModule } from '~viewer/components/spinner/spinner.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ApplicationInfoComponent],
  exports: [ApplicationInfoComponent],
  imports: [CommonModule, PipesModule, RouterModule, SpinnerModule],
})
export class ApplicationInfoModule {}
